import { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useApplications, useUpdateApplication } from '../hooks/useApplications';
import { Application } from '../types';
import ApplicationCard from '../components/ApplicationCard';
import StatusBadge from '../components/StatusBadge';

const KanbanPage = () => {
    const { data: applicationsData, isLoading } = useApplications({ limit: 1000 });
    const updateMutation = useUpdateApplication();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const applications = applicationsData?.data || [];

    const statuses: Application['status'][] = [
        'Backlog',
        'Applied',
        'HR Screen',
        'Technical Round',
        'Managerial Round',
        'Offer',
        'Rejected',
        'On hold',
    ];

    const getApplicationsByStatus = (status: Application['status']) => {
        return applications.filter((app) => app.status === status);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const applicationId = active.id as string;
        const newStatus = over.id as Application['status'];

        const application = applications.find((app) => app._id === applicationId);

        if (application && application.status !== newStatus) {
            updateMutation.mutate({
                id: applicationId,
                data: { status: newStatus },
            });
        }

        setActiveId(null);
    };

    const activeApplication = applications.find((app) => app._id === activeId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">Kanban Board</h1>
                <p className="text-gray-600 dark:text-gray-400">Drag and drop applications to update their status</p>
            </div>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="overflow-x-auto pb-4">
                    <div className="inline-flex space-x-4 min-w-full">
                        {statuses.map((status) => {
                            const statusApps = getApplicationsByStatus(status);

                            return (
                                <div
                                    key={status}
                                    id={status}
                                    className="flex-shrink-0 w-80"
                                >
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-full border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <StatusBadge status={status} />
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {statusApps.length}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 min-h-[200px]">
                                            {statusApps.map((app) => (
                                                <div
                                                    key={app._id}
                                                    id={app._id}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.effectAllowed = 'move';
                                                        e.dataTransfer.setData('text/plain', app._id);
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        e.dataTransfer.dropEffect = 'move';
                                                    }}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        const draggedId = e.dataTransfer.getData('text/plain');
                                                        if (draggedId !== app._id) {
                                                            updateMutation.mutate({
                                                                id: draggedId,
                                                                data: { status },
                                                            });
                                                        }
                                                    }}
                                                    className="cursor-move"
                                                >
                                                    <ApplicationCard application={app} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <DragOverlay>
                    {activeApplication && (
                        <div className="opacity-90">
                            <ApplicationCard application={activeApplication} />
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanPage;
