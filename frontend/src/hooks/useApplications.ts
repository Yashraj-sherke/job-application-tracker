import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '../api/applications';
import { Application, ApplicationFilters, Interaction } from '../types';
import toast from 'react-hot-toast';

export const useApplications = (filters?: ApplicationFilters) => {
    return useQuery({
        queryKey: ['applications', filters],
        queryFn: () => applicationsApi.getAll(filters),
    });
};

export const useApplication = (id: string) => {
    return useQuery({
        queryKey: ['application', id],
        queryFn: () => applicationsApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (application: Partial<Application>) => applicationsApi.create(application),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('Application created successfully!');
        },
    });
};

export const useUpdateApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
            applicationsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
            toast.success('Application updated successfully!');
        },
    });
};

export const useDeleteApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => applicationsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('Application deleted successfully!');
        },
    });
};

export const useFollowUps = () => {
    return useQuery({
        queryKey: ['follow-ups'],
        queryFn: () => applicationsApi.getFollowUps(),
    });
};

export const useAddInteraction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, interaction }: { id: string; interaction: Omit<Interaction, '_id'> }) =>
            applicationsApi.addInteraction(id, interaction),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
            toast.success('Interaction added successfully!');
        },
    });
};

export const useExportCSV = () => {
    return useMutation({
        mutationFn: () => applicationsApi.exportCSV(),
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Applications exported successfully!');
        },
    });
};

export const useImportCSV = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => applicationsApi.importCSV(file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success(`Successfully imported ${data.length} applications!`);
        },
    });
};
