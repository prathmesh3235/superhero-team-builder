import React, { useState, useEffect, useRef } from "react";
import axios from "../utils/axiosInstance";
import { motion, useAnimation } from "framer-motion";
import TeamCard from "./TeamCard";
import BattleResult from "./BattleResult";

const TeamBattleSimulator = () => {
  const [heroes, setHeroes] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamAType, setTeamAType] = useState("");
  const [teamBType, setTeamBType] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const compareButtonRef = useRef(null);
  const resultContainerRef = useRef(null);
  const containerRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get("/superheroes");
        setHeroes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch heroes", error);
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  const handleTeamSelect = (team, type, selectedType) => {
    if (type === "A") {
      setTeamA(team);
      setTeamAType(selectedType);
    } else {
      setTeamB(team);
      setTeamBType(selectedType);
    }
  };
  useEffect(() => {
    if (teamA.length > 0 && compareButtonRef.current) {
      compareButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [teamA]);

  useEffect(() => {
    if (teamB.length > 0 && compareButtonRef.current) {
      compareButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [teamB]);

  useEffect(() => {
    if (comparisonResult && resultContainerRef.current) {
      resultContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [comparisonResult]);

  const getTeam = (criteria) => {
    let selectedHeroes;
    switch (criteria) {
      case "balanced":
        selectedHeroes = ["good", "bad", "neutral"].flatMap((alignment) =>
          heroes
            .filter((hero) => hero.alignment === alignment)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)
        );
        break;
      case "strength":
        selectedHeroes = heroes
          .sort((a, b) => b.strength - a.strength)
          .slice(0, 5);
        break;
      case "intelligence":
        selectedHeroes = heroes
          .sort((a, b) => b.intelligence - a.intelligence)
          .slice(0, 5);
        break;
      case "random":
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
    const intelligenceDiff =
      statsA.totalIntelligence - statsB.totalIntelligence;
    const speedDiff = statsA.totalSpeed - statsB.totalSpeed;

    if (
      Math.abs(strengthDiff) > Math.abs(intelligenceDiff) &&
      Math.abs(strengthDiff) > Math.abs(speedDiff)
    ) {
      winner = strengthDiff > 0 ? "Team A" : "Team B";
      reason = `They have superior strength (${Math.abs(
        strengthDiff
      )} points difference).`;
    } else if (Math.abs(intelligenceDiff) > Math.abs(speedDiff)) {
      winner = intelligenceDiff > 0 ? "Team A" : "Team B";
      reason = `They have superior intelligence (${Math.abs(
        intelligenceDiff
      )} points difference).`;
    } else {
      winner = speedDiff > 0 ? "Team A" : "Team B";
      reason = `They have superior speed (${Math.abs(
        speedDiff
      )} points difference).`;
    }

    const isTeamABalanced = Object.keys(statsA.alignmentBalance).length >= 2;
    const isTeamBBalanced = Object.keys(statsB.alignmentBalance).length >= 2;
    if (isTeamABalanced && !isTeamBBalanced) {
      winner = "Team A";
      reason +=
        " Moreover, Team A has a more balanced alignment, giving them an edge in team dynamics.";
    } else if (!isTeamABalanced && isTeamBBalanced) {
      winner = "Team B";
      reason +=
        " Moreover, Team B has a more balanced alignment, giving them an edge in team dynamics.";
    }

    setComparisonResult({ winner, reason, statsA, statsB });
  };

  const handleTeamASelect = (type) => {
    setTeamA(getTeam(type));
    setTeamAType(type);
  };

  const handleTeamBSelect = (type) => {
    setTeamB(getTeam(type));
    setTeamBType(type);
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
    <div
      ref={containerRef}
      className="max-w-6xl mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl"
    >
      <motion.h1
        className="text-4xl font-bold text-center text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Team Battle Simulator
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TeamCard
          team={teamA}
          type="A"
          onSelect={handleTeamASelect}
          disabledOption={teamBType}
        />
        <TeamCard
          team={teamB}
          type="B"
          onSelect={handleTeamBSelect}
          disabledOption={teamAType}
        />
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
        {comparisonResult && (
          <BattleResult
            result={comparisonResult}
            statsA={comparisonResult.statsA}
            statsB={comparisonResult.statsB}
          />
        )}
      </div>
    </div>
  );
};

export default TeamBattleSimulator;
