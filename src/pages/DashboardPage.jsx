import { useGetDashboardStatsQuery } from "../features/events/eventsApi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PIE_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#FF8042",
  "#00C49F",
  "#FFBB28",
];
const BAR_COLOR = "#3b82f6";

const statusMap = {
  scheduled: "Prévu",
  ongoing: "En cours",
  cancelled: "Annulé",
  done: "Terminé",
};

const DashboardPage = () => {
  const { data: stats, error, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <p className="text-center text-indigo-500 dark:text-indigo-300 mt-10">
        Chargement des statistiques...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 dark:text-red-400 mt-10">
        Erreur lors du chargement des statistiques :{" "}
        {error.data?.message || "Une erreur est survenue."}
      </p>
    );
  }

  if (!stats || Object.keys(stats).length === 0) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400 mt-10">
        Aucune donnée statistique disponible pour le moment.
      </p>
    );
  }

  const {
    totalEvents,
    eventsToday,
    eventsByLocation,
    eventsByStatus,
    topEventsByParticipants,
  } = stats;

  const formattedEventsByStatus = eventsByStatus.map((item) => ({
    name: statusMap[item._id] || item._id,
    value: item.count,
  }));

  const formattedEventsByLocation = eventsByLocation.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Tableau de Bord Global
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2 rounded-lg shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-sm font-semibold mb-0.5">Total Événements</h2>
          <p className="text-2xl font-bold">{totalEvents}</p>
        </div>

        <div className="lg:col-span-1 bg-gradient-to-br from-green-500 to-teal-600 text-white p-2 rounded-lg shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-sm font-semibold mb-0.5">
            Événements Aujourd'hui
          </h2>
          <p className="text-2xl font-bold">{eventsToday}</p>
        </div>

        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Top 5 Événements par Participants
          </h2>
          {topEventsByParticipants && topEventsByParticipants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Participants
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topEventsByParticipants.map((event) => (
                    <tr
                      key={event._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {event.nbParticipants}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Aucun événement avec des participants enregistrés.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Événements par Statut
          </h2>
          {formattedEventsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formattedEventsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {formattedEventsByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-status-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Aucune donnée de statut disponible.
            </p>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Événements par Lieu
          </h2>
          {formattedEventsByLocation.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={formattedEventsByLocation}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e0e0e0"
                  className="dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="name"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  height={50}
                  stroke="#333"
                  className="dark:text-gray-200"
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#333"
                  className="dark:text-gray-200"
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={BAR_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Aucune donnée de lieu disponible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
