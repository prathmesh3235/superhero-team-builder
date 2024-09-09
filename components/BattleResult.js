import React from "react";
import { motion } from "framer-motion";
import StatBar from "./StatBar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Shield, Zap, Brain } from "lucide-react";

const BattleResult = ({ result, statsA, statsB }) => (
  <motion.div
    className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-2xl font-bold text-white mb-4">Battle Result</h3>
    <p className="text-xl text-green-400 mb-2">{result.winner} wins!</p>
    <p className="text-gray-300 mb-4">{result.reason}</p>

    {/* Displaying individual stats using StatBar */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Team A Stats</h4>
        <StatBar
          icon={<Shield />}
          label="Strength"
          value={statsA.totalStrength}
        />
        <StatBar
          icon={<Brain />}
          label="Intelligence"
          value={statsA.totalIntelligence}
        />
        <StatBar icon={<Zap />} label="Speed" value={statsA.totalSpeed} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Team B Stats</h4>
        <StatBar
          icon={<Shield />}
          label="Strength"
          value={statsB.totalStrength}
        />
        <StatBar
          icon={<Brain />}
          label="Intelligence"
          value={statsB.totalIntelligence}
        />
        <StatBar icon={<Zap />} label="Speed" value={statsB.totalSpeed} />
      </div>
    </div>

    {/* Comparative bar chart using Recharts */}
    <ResponsiveContainer width="100%" height={200} className="mt-4">
      <BarChart
        data={[
          {
            name: "Strength",
            TeamA: statsA.totalStrength,
            TeamB: statsB.totalStrength,
          },
          {
            name: "Intelligence",
            TeamA: statsA.totalIntelligence,
            TeamB: statsB.totalIntelligence,
          },
          { name: "Speed", TeamA: statsA.totalSpeed, TeamB: statsB.totalSpeed },
        ]}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="TeamA" fill="#4CAF50" name="Team A" />
        <Bar dataKey="TeamB" fill="#2196F3" name="Team B" />
      </BarChart>
    </ResponsiveContainer>
  </motion.div>
);

export default BattleResult;
