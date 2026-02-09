import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  image_url: string | null;
  visible: boolean;
  sort_order: number;
}

export function useHeroSlides(onlyVisible = false) {
  return useQuery({
    queryKey: ['hero-slides', onlyVisible],
    queryFn: async (): Promise<HeroSlide[]> => {
      let query = supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });

      if (onlyVisible) {
        query = query.eq('visible', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as HeroSlide[];
    },
  });
}

export function useAdminHeroSlides() {
  const queryClient = useQueryClient();

  const slides = useQuery({
    queryKey: ['hero-slides', false],
    queryFn: async (): Promise<HeroSlide[]> => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return (data || []) as HeroSlide[];
    },
  });

  const createSlide = useMutation({
    mutationFn: async (slide: Omit<HeroSlide, 'id'>) => {
      const { data, error } = await supabase
        .from('hero_slides')
        .insert(slide)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    },
  });

  const updateSlide = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HeroSlide> & { id: string }) => {
      const { data, error } = await supabase
        .from('hero_slides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    },
  });

  const deleteSlide = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    },
  });

  return {
    slides: slides.data || [],
    isLoading: slides.isLoading,
    createSlide,
    updateSlide,
    deleteSlide,
  };
}
