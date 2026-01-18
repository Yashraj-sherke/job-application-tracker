import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Application from '../models/Application';
import { protect, AuthRequest } from '../middleware/auth';
import { Parser } from 'json2csv';
import multer from 'multer';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes are protected
router.use(protect);

// @route   POST /api/applications
// @desc    Create a new application
// @access  Private
router.post(
    '/',
    [
        body('companyName').trim().notEmpty().withMessage('Company name is required'),
        body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
        body('jobPortal').isIn(['LinkedIn', 'Naukri', 'Foundit', 'Glassdoor', 'Company site', 'Other']).withMessage('Invalid job portal'),
        body('employmentType').isIn(['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Hybrid', 'On-site']).withMessage('Invalid employment type'),
        body('source').isIn(['Referral', 'Direct', 'Job board', 'Recruiter']).withMessage('Invalid source'),
    ],
    async (req: AuthRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
                return;
            }

            const application = await Application.create({
                ...req.body,
                userId: req.user!._id,
            });

            res.status(201).json({
                success: true,
                data: application,
            });
        } catch (error: any) {
            console.error('Create application error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating application',
            });
        }
    }
);

// @route   GET /api/applications
// @desc    Get all applications for logged-in user with filters
// @access  Private
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const {
            portal,
            status,
            location,
            employmentType,
            dateFrom,
            dateTo,
            search,
            sortBy = 'dateApplied',
            order = 'desc',
            page = '1',
            limit = '10',
        } = req.query;

        // Build filter query
        const filter: any = { userId: req.user!._id };

        if (portal) filter.jobPortal = portal;
        if (status) filter.status = status;
        if (location) filter.location = new RegExp(location as string, 'i');
        if (employmentType) filter.employmentType = employmentType;

        if (dateFrom || dateTo) {
            filter.dateApplied = {};
            if (dateFrom) filter.dateApplied.$gte = new Date(dateFrom as string);
            if (dateTo) filter.dateApplied.$lte = new Date(dateTo as string);
        }

        if (search) {
            filter.$or = [
                { companyName: new RegExp(search as string, 'i') },
                { jobTitle: new RegExp(search as string, 'i') },
            ];
        }

        // Pagination
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        // Sort
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions: any = { [sortBy as string]: sortOrder };

        // Execute query
        const applications = await Application.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const total = await Application.countDocuments(filter);

        res.json({
            success: true,
            data: applications,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error: any) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
        });
    }
});

// @route   GET /api/applications/follow-ups
// @desc    Get applications needing follow-up
// @access  Private
router.get('/follow-ups', async (req: AuthRequest, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const applications = await Application.find({
            userId: req.user!._id,
            followUpDate: { $lte: new Date() },
            status: { $nin: ['Rejected', 'Offer'] },
        }).sort({ followUpDate: 1 });

        res.json({
            success: true,
            data: applications,
        });
    } catch (error: any) {
        console.error('Get follow-ups error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching follow-ups',
        });
    }
});

// @route   GET /api/applications/export
// @desc    Export applications to CSV
// @access  Private
router.get('/export', async (req: AuthRequest, res: Response) => {
    try {
        const applications = await Application.find({ userId: req.user!._id }).lean();

        const fields = [
            'companyName',
            'jobTitle',
            'jobPortal',
            'jobLink',
            'location',
            'employmentType',
            'dateApplied',
            'status',
            'source',
            'salaryRange',
            'recruiterName',
            'recruiterEmail',
            'recruiterPhone',
            'followUpDate',
            'notes',
            'resumeVersion',
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(applications);

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=applications.csv');
        res.send(csv);
    } catch (error: any) {
        console.error('Export error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting applications',
        });
    }
});

// @route   POST /api/applications/import
// @desc    Import applications from CSV
// @access  Private
router.post('/import', upload.single('file'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
            return;
        }

        const results: any[] = [];
        const stream = Readable.from(req.file.buffer.toString());

        stream
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    const applications = results.map((row) => ({
                        userId: req.user!._id,
                        companyName: row.companyName,
                        jobTitle: row.jobTitle,
                        jobPortal: row.jobPortal || 'Other',
                        jobLink: row.jobLink,
                        location: row.location,
                        employmentType: row.employmentType || 'Full-time',
                        dateApplied: row.dateApplied ? new Date(row.dateApplied) : new Date(),
                        status: row.status || 'Backlog',
                        source: row.source || 'Job board',
                        salaryRange: row.salaryRange,
                        recruiterName: row.recruiterName,
                        recruiterEmail: row.recruiterEmail,
                        recruiterPhone: row.recruiterPhone,
                        followUpDate: row.followUpDate ? new Date(row.followUpDate) : undefined,
                        notes: row.notes,
                        resumeVersion: row.resumeVersion,
                    }));

                    const created = await Application.insertMany(applications);

                    res.json({
                        success: true,
                        message: `Successfully imported ${created.length} applications`,
                        data: created,
                    });
                } catch (error: any) {
                    console.error('Import processing error:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Error processing CSV data',
                    });
                }
            });
    } catch (error: any) {
        console.error('Import error:', error);
        res.status(500).json({
            success: false,
            message: 'Error importing applications',
        });
    }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.user!._id,
        });

        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found',
            });
            return;
        }

        res.json({
            success: true,
            data: application,
        });
    } catch (error: any) {
        console.error('Get application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
        });
    }
});

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.user!._id,
        });

        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found',
            });
            return;
        }

        // Track status change
        if (req.body.status && req.body.status !== application.status) {
            application.statusHistory.push({
                status: req.body.status,
                changedAt: new Date(),
            });
        }

        // Update fields
        Object.assign(application, req.body);
        await application.save();

        res.json({
            success: true,
            data: application,
        });
    } catch (error: any) {
        console.error('Update application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating application',
        });
    }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!._id,
        });

        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found',
            });
            return;
        }

        res.json({
            success: true,
            message: 'Application deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting application',
        });
    }
});

// @route   POST /api/applications/:id/interactions
// @desc    Add interaction to application
// @access  Private
router.post('/:id/interactions', async (req: AuthRequest, res: Response) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.user!._id,
        });

        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found',
            });
            return;
        }

        application.interactions.push(req.body);
        await application.save();

        res.json({
            success: true,
            data: application,
        });
    } catch (error: any) {
        console.error('Add interaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding interaction',
        });
    }
});

export default router;
