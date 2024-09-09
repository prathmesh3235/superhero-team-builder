import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, useAnimation } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, Zap, Brain } from 'lucide-react';

const TeamCard = ({ team, type, onSelect }) => (
  <motion.div 
    className="bg-gray-800 p-4 rounded-lg shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-xl font-bold text-white mb-2">Team {type}</h3>
    <select 
      className="w-full p-2 bg-gray-700 text-white rounded mb-4"
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Select Team Type</option>
      <option value="balanced">Balanced</option>
      <option value="strength">Strength-based</option>
      <option value="intelligence">Intelligence-based</option>
      <option value="random">Random</option>
    </select>
    {team.map((hero, index) => (
      <motion.div 
        key={hero.id} 
        className="bg-gray-700 p-2 rounded mb-2 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${
          hero.alignment === 'good' ? 'bg-green-500' : 
          hero.alignment === 'bad' ? 'bg-red-500' : 'bg-yellow-500'
        }`}>
          {hero.name.charAt(0)}
        </div>
        <span className="text-white">{hero.name}</span>
        <span className="text-gray-400 ml-auto">{hero.alignment}</span>
      </motion.div>
    ))}
  </motion.div>
);

const BattleResult = ({ result }) => (
  <motion.div 
    className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-2xl font-bold text-white mb-4">Battle Result</h3>
    <p className="text-xl text-green-400 mb-2">{result.winner} wins!</p>
    <p className="text-gray-300 mb-4">{result.reason}</p>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Team A Stats</h4>
        <StatBar icon={<Shield />} label="Strength" value={result.statsA.totalStrength} />
        <StatBar icon={<Brain />} label="Intelligence" value={result.statsA.totalIntelligence} />
        <StatBar icon={<Zap />} label="Speed" value={result.statsA.totalSpeed} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Team B Stats</h4>
        <StatBar icon={<Shield />} label="Strength" value={result.statsB.totalStrength} />
        <StatBar icon={<Brain />} label="Intelligence" value={result.statsB.totalIntelligence} />
        <StatBar icon={<Zap />} label="Speed" value={result.statsB.totalSpeed} />
      </div>
    </div>
    <ResponsiveContainer width="100%" height={200} className="mt-4">
      <BarChart data={[
        {name: 'Strength', A: result.statsA.totalStrength, B: result.statsB.totalStrength},
        {name: 'Intelligence', A: result.statsA.totalIntelligence, B: result.statsB.totalIntelligence},
        {name: 'Speed', A: result.statsA.totalSpeed, B: result.statsB.totalSpeed},
      ]}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="A" fill="#4CAF50" name="Team A" />
        <Bar dataKey="B" fill="#2196F3" name="Team B" />
      </BarChart>
    </ResponsiveContainer>
  </motion.div>
);

const StatBar = ({ icon, label, value }) => (
  <div className="flex items-center mb-2">
    {icon}
    <span className="text-white ml-2">{label}:</span>
    <div className="ml-auto bg-gray-700 w-32 h-4 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${(value / 500) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
    <span className="text-white ml-2 w-8 text-right">{value}</span>
  </div>
);

const TeamBattleSimulator = () => {
  const [heroes, setHeroes] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const compareButtonRef = useRef(null);
  const resultContainerRef = useRef(null);
  const containerRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get('/api/superheroes');
        setHeroes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch heroes', error);
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  useEffect(() => {
    if (teamA.length > 0 && compareButtonRef.current) {
      compareButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [teamA]);

  useEffect(() => {
    if (teamB.length > 0 && compareButtonRef.current) {
      compareButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [teamB]);

  useEffect(() => {
    if (comparisonResult && resultContainerRef.current) {
      resultContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [comparisonResult]);

  const getTeam = (criteria) => {
    let selectedHeroes;
    switch (criteria) {
      case 'balanced':
        selectedHeroes = ['good', 'bad', 'neutral'].flatMap(alignment =>
          heroes.filter(hero => hero.alignment === alignment)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)
        );
        break;
      case 'strength':
        selectedHeroes = heroes.sort((a, b) => b.strength - a.strength).slice(0, 5);
        break;
      case 'intelligence':
        selectedHeroes = heroes.sort((a, b) => b.intelligence - a.intelligence).slice(0, 5);
        break;
      case 'random':
        selectedHeroes = heroes.sort(() => 0.5 - Math.random()).slice(0, 5);
        break;
      default:
        selectedHeroes = [];
    }
    return selectedHeroes;
  };

  const compareTeams = () => {
    const calculateTeamStats = (team) => ({
      totalStrength: team.reduce((sum, hero) => sum + hero.strength, 0),
      totalIntelligence: team.reduce((sum, hero) => sum + hero.intelligence, 0),
      totalSpeed: team.reduce((sum, hero) => sum + hero.speed, 0),
      alignmentBalance: team.reduce((balance, hero) => {
        balance[hero.alignment] = (balance[hero.alignment] || 0) + 1;
        return balance;
      }, {}),
    });

    const statsA = calculateTeamStats(teamA);
    const statsB = calculateTeamStats(teamB);

    let winner, reason;
    const strengthDiff = statsA.totalStrength - statsB.totalStrength;
    const intelligenceDiff = statsA.totalIntelligence - statsB.totalIntelligence;
    const speedDiff = statsA.totalSpeed - statsB.totalSpeed;

    if (Math.abs(strengthDiff) > Math.abs(intelligenceDiff) && Math.abs(strengthDiff) > Math.abs(speedDiff)) {
      winner = strengthDiff > 0 ? 'Team A' : 'Team B';
      reason = `They have superior strength (${Math.abs(strengthDiff)} points difference).`;
    } else if (Math.abs(intelligenceDiff) > Math.abs(speedDiff)) {
      winner = intelligenceDiff > 0 ? 'Team A' : 'Team B';
      reason = `They have superior intelligence (${Math.abs(intelligenceDiff)} points difference).`;
    } else {
      winner = speedDiff > 0 ? 'Team A' : 'Team B';
      reason = `They have superior speed (${Math.abs(speedDiff)} points difference).`;
    }

    // Consider alignment balance as a potential game-changer
    const isTeamABalanced = Object.keys(statsA.alignmentBalance).length >= 2;
    const isTeamBBalanced = Object.keys(statsB.alignmentBalance).length >= 2;
    if (isTeamABalanced && !isTeamBBalanced) {
      winner = 'Team A';
      reason += " Moreover, Team A has a more balanced alignment, giving them an edge in team dynamics.";
    } else if (!isTeamABalanced && isTeamBBalanced) {
      winner = 'Team B';
      reason += " Moreover, Team B has a more balanced alignment, giving them an edge in team dynamics.";
    }

    setComparisonResult({ winner, reason, statsA, statsB });
  };

  const handleTeamASelect = (type) => {
    setTeamA(getTeam(type));
  };

  const handleTeamBSelect = (type) => {
    setTeamB(getTeam(type));
  };

  if (loading) {
    return (
      <div className="text-center text-white text-2xl py-20">
        <motion.div 
          className="inline-block"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, loop: Infinity }}
        >
          <span className="inline-block w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></span>
        </motion.div>
        <p className="mt-4">Loading heroes...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl">
      <motion.h1 
        className="text-4xl font-bold text-center text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Team Battle Simulator
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TeamCard team={teamA} type="A" onSelect={handleTeamASelect} />
        <TeamCard team={teamB} type="B" onSelect={handleTeamBSelect} />
      </div>
      <motion.button
        ref={compareButtonRef}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-300"
        onClick={compareTeams}
        disabled={teamA.length === 0 || teamB.length === 0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Compare Teams
      </motion.button>
      <div ref={resultContainerRef} className="mt-8">
        {comparisonResult && <BattleResult result={comparisonResult} />}
      </div>
    </div>
  );
};

export default TeamBattleSimulator;
