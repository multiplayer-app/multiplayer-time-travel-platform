import { useEffect, useState } from "react";

const ADJECTIVES = [
  "Curious",
  "Wandering",
  "Lost",
  "Sleepy",
  "Silent",
  "Drifting",
  "Lucky",
  "Sneaky",
  "Eternal",
  "Bubbly",
  "Rusty",
  "Dazed",
  "Glitchy",
  "Cosmic",
  "Zany",
  "Ancient",
  "Blinking",
  "Eager",
];

const NOUNS = [
  "Chrononaut",
  "Time Hopper",
  "Temporal Nomad",
  "Timewalker",
  "Voyager",
  "Clocksmith",
  "Paradox",
  "Aeonwalker",
  "Time Tinkerer",
  "Loop Rider",
  "Gearhead",
  "Flux Diver",
  "Chronomancer",
  "Hour Skipper",
  "Era Surfer",
  "Time Glider",
  "Portal Jumper",
  "Clock Whisperer",
  "Rift Scout",
  "Future Skater",
];

const generateRandomName = () => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective} ${noun}`;
};

export const useAnonymousTimeTravelerName = () => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const savedName = localStorage.getItem("mp-timeTravelerName");
    if (savedName) {
      setName(savedName);
    } else {
      const newName = generateRandomName();
      localStorage.setItem("mp-timeTravelerName", newName);
      setName(newName);
    }
  }, []);

  return name;
};
