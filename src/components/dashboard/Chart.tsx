import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '8 PM', value: 2 },
  { name: '9 PM', value: 4 },
  { name: '10 PM', value: 7 },
  { name: '11 PM', value: 9 },
  { name: '12 AM', value: 11 },
  { name: '1 AM', value: 12 },
];

const Chart = () => {
  return (
    <div className="h-[300px] w-full bg-dashboard-card rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Beer Consumption Timeline</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#9b87f5"
            strokeWidth={2}
            dot={{ fill: '#9b87f5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;