import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddEventMutation } from '../../features/events/eventsApi'; 

const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis.'),
  description: z.string().optional(),
  date: z.string()
    .min(1, 'La date est requise.')
    .refine((val) => !isNaN(new Date(val).getTime()), "Format de date invalide (ex: YYYY-MM-DD)."),
  location: z.string().min(1, 'Le lieu est requis.'),
  category: z.enum(["conference", "workshop", "concert"]).default("concert"),
  nbParticipants: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
      .int("Le nombre de participants doit être un entier.")
      .min(0, "Le nombre de participants ne peut pas être négatif.")
      .optional()
  ),
  isPublic: z.boolean().default(true),
  status: z.enum(["scheduled", "ongoing", "cancelled", "done"]).default("scheduled"),
  imageUrl: z.string().url("URL de l'image invalide.").optional().or(z.literal('')),
});

const EventFormModal = ({ isOpen, onClose }) => {
  const [addEvent, { isLoading }] = useAddEventMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      category: 'concert',
      nbParticipants: 0,
      isPublic: true,
      status: 'scheduled',
      imageUrl: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        date: new Date(data.date).toISOString(),
        nbParticipants: data.nbParticipants === undefined ? 0 : data.nbParticipants
      };
      
      await addEvent(formattedData).unwrap();
      alert('Événement ajouté avec succès !');
      reset();
      onClose(); 
    } catch (err) {
      console.error('Échec de l\'ajout de l\'événement :', err);
      alert(`Échec de l'ajout de l'événement : ${err.data?.message || err.error || 'Une erreur est survenue.'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto my-auto max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Ajouter un nouvel événement</h3>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-3xl font-bold"
        >
          &times;
        </button>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Titre</label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optionnel)</label>
            <textarea
              id="description"
              {...register('description')}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lieu</label>
            <input
              id="location"
              type="text"
              {...register('location')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
            <select
              id="category"
              {...register('category')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="conference">Conférence</option>
              <option value="workshop">Atelier</option>
              <option value="concert">Concert</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="nbParticipants" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de participants (Optionnel)</label>
            <input
              id="nbParticipants"
              type="number"
              {...register('nbParticipants')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.nbParticipants && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nbParticipants.message}</p>}
          </div>

          <div className="flex items-center">
            <input
              id="isPublic"
              type="checkbox"
              {...register('isPublic')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Événement public
            </label>
            {errors.isPublic && <p className="ml-4 text-sm text-red-600 dark:text-red-400">{errors.isPublic.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="scheduled">Prévu</option>
              <option value="ongoing">En cours</option>
              <option value="cancelled">Annulé</option>
              <option value="done">Terminé</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {isLoading ? 'Ajout en cours...' : 'Ajouter l\'événement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;