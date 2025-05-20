import FreddieMercury from "../assets/characters/FreddieMercury.png";
import Pikachu from "../assets/characters/Pikachu.png";
import Yoda from "../assets/characters/Yoda.png";
import AdaLovelace from "../assets/characters/AdaLovelace.png";
import JuliaChild from "../assets/characters/JuliaChild.png";
import EllenRipley from "../assets/characters/EllenRipley.png";
import DocBrown from "../assets/characters/DocBrown.png";
import AlanTuring from "../assets/characters/AlanTuring.png";
import MargaretHamilton from "../assets/characters/MargaretHamilton.png";
import FridaKahlo from "../assets/characters/FridaKahlo.png";

import FreddieMercury_Panel from "../assets/panel_imgs/Freddie_Mercury.jpg";
import Pikachu_Panel from "../assets/panel_imgs/Pikachu.png";
import Yoda_Panel from "../assets/panel_imgs/Yoda.jpg";
import AdaLovelace_Panel from "../assets/panel_imgs/Ada-Lovelace.webp";
import JuliaChild_Panel from "../assets/panel_imgs/Julia_Child.jpg";
import EllenRipley_Panel from "../assets/panel_imgs/EllenRipley.webp";
import DocBrown_Panel from "../assets/panel_imgs/DocBrown.jpg";
import AlanTuring_Panel from "../assets/panel_imgs/Alan_Turing.jpg";
import MargaretHamilton_Panel from "../assets/panel_imgs/Hamilton-Margaret.jpg";
import FridaKahlo_Panel from "../assets/panel_imgs/Frida_Kahlo.webp";

export const characters = [
  {
    name: "Freddie Mercury",
    startDate: {
      isBCE: false,
      date: "1946-09-05",
      bceString: null,
    },
    endDate: {
      isBCE: false,
      date: "1991-10-24",
      bceString: null,
    },
    questions: [
      "Is this a real bug? Or is this just fantasy?",
      "Can you feel the latency tonight?",
      "Mama... just killed a deploy. Pushed some code, now prod is gone.",
    ],
    avatar: FreddieMercury,
    panelImg: FreddieMercury_Panel,
    pronoun: "He",
    description: "Iconic rock vocalist and Queen frontman",
    answerStyle:
      "Would demand that error messages be sung. Would also insist that your broken app is still beautiful, and that all software bugs should be performed live on stage.",
  },
  {
    name: "Pikachu",
    startDate: {
      isBCE: false,
      date: "1996-02-27",
      bceString: null,
    },
    endDate: {
      isBCE: false,
      date: "2020-12-31",
      bceString: null,
    },
    questions: [
      `"Pipipipi-chuchuchu… Pi?" (why is the app so slow?)`,
      `"Pikapikapika… pi-ka chu?" (how do I trace this bug across services?)`,
      `"PikakaPika… chuuu-pika, Pi?" (why is the data flow doing this unexpected thing?)`,
    ],
    avatar: Pikachu,
    panelImg: Pikachu_Panel,
    pronoun: "He",
    description: "Electric-type Pokémon and loyal companion",
    answerStyle: "Only says “Pika Pika”",
  },
  {
    name: "Yoda",
    startDate: {
      isBCE: true,
      date: null,
      bceString: "0896-01-01",
    },
    endDate: {
      isBCE: false,
      date: "0004-01-01",
      bceString: null,
    },
    questions: [
      "Bad, my API design is. Change it, I must.",
      "Hidden data in the logs, must I find, hmm?",
      "Fix this, how would you, Master Yoda?",
    ],
    avatar: Yoda,
    panelImg: Yoda_Panel,
    pronoun: "He",
    description: "Jedi Master and wise mentor from Star Wars",
    answerStyle:
      "Would critique your entire codebase in cryptic syntax. Might insist on pair programming via telepathy.",
  },
  {
    name: "Ada Lovelace",
    startDate: {
      isBCE: false,
      date: "1815-12-10",
      bceString: null,
    },
    endDate: {
      isBCE: false,
      date: "1852-11-27",
      bceString: null,
    },
    questions: [
      "Might you assist me in deciphering the logic behind this most perplexing state transition?",
      "In what manner might we best preserve the intent behind this algorithm?",
      "Might the error be not within the machine, but in the assumptions of its maker?",
    ],
    avatar: AdaLovelace,
    panelImg: AdaLovelace_Panel,
    pronoun: "She",
    description: "Mathematician and early computer programmer",
    answerStyle:
      "The first programmer. Would love to see her reaction to modern computing and hear her ideas on what she could have done with today’s tools.",
  },
  {
    name: "Julia Child",
    startDate: {
      isBCE: false,
      date: "1912-08-15",
      bceString: null,
    },
    endDate: {
      isBCE: false,
      date: "2004-08-13",
      bceString: null,
    },
    questions: [
      "What’s the missing ingredient in this integration?",
      "What exactly is in this data stew? I’m tasting at least three unintended side effects.",
      "Do you think this bug is baked in, or did someone forget the unit tests?",
    ],
    avatar: JuliaChild,
    panelImg: JuliaChild_Panel,
    pronoun: "She",
    description: "Chef and television personality",
    answerStyle:
      "Would explain APIs like recipes, compare microservices to a well-planned kitchen, and immediately break something just to show you how to fix it.",
  },
  {
    name: "Ellen Ripley",
    startDate: {
      isBCE: false,
      date: "2092-01-07",
      bceString: null,
    },
    endDate: {
      isBCE: false,
      date: "2179-05-24",
      bceString: null,
    },
    questions: [
      "I patched this issue once, yet it keeps coming back. Have you seen it happen before?",
      "How resilient is this API, really?",
      "Something’s breaking the data pipeline. And it’s not gonna fix itself.",
    ],
    avatar: EllenRipley,
    panelImg: EllenRipley_Panel,
    pronoun: "She",
    description: "Fearless space officer and alien fighter",
    answerStyle:
      "One of the most competent problem-solvers in sci-fi. Would 100% call out bad system design and tell you exactly where the failure points are before things go horribly wrong.",
  },
  {
    name: "Doc Brown",
    startDate: {
      isBCE: false,
      date: "1920-04-05",
      bceString: null,
    },
    endDate: {
      isBCE: false,
      date: "2045-10-21",
      bceString: null,
    },
    questions: [
      "Great Scott! There's too much latency. What should I do?",
      "How do I get this timeline back on track?",
      "How much processing power do I need to go back to before that deployment broke everything?",
    ],
    avatar: DocBrown,
    panelImg: DocBrown_Panel,
    pronoun: "He",
    description: "Inventor and time travel enthusiast",
    answerStyle:
      "Would insist that every system failure could be solved with a flux capacitor and a little plutonium.",
  },
  {
    name: "Alan Turing",
    startDate: {
      isBCE: false,
      date: "1912-06-23",
      bceString: null,
    },
    endDate: {
      isBCE: false,
      date: "1954-06-07",
      bceString: null,
    },
    questions: [
      "Given these inputs, is the system’s response non-deterministic?",
      "This process appears decidable, yet the machine stalls. Why?",
      "Is the anomaly within the logic, or the assumptions behind it?",
    ],
    avatar: AlanTuring,
    panelImg: AlanTuring_Panel,
    pronoun: "He",
    description: "Mathematician and pioneer of computing",
    answerStyle:
      "The father of modern computing, AI pioneer, and codebreaker. He’d have incredible insights into algorithms, machine learning, and cryptography.",
  },
  {
    name: "Margaret Hamilton",
    startDate: {
      isBCE: false,
      date: "1936-08-17",
      bceString: null,
    },
    endDate: null,
    questions: [
      "Where’s the fail-safe if this service crashes mid-operation?",
      "Is this system built for success, or merely survival?",
      "If you launched this code to space, would you trust it to come back?",
    ],
    avatar: MargaretHamilton,
    panelImg: MargaretHamilton_Panel,
    pronoun: "She",
    description: "Software engineer and Apollo mission leader",
    answerStyle:
      "The software engineer who wrote the Apollo mission code. Would probably have incredible debugging stories from spaceflight programming.",
  },
  {
    name: "Frida Kahlo",
    startDate: {
      isBCE: false,
      date: "1907-07-06",
      bceString: null,
    },
    endDate: {
      isBCE: false,
      date: "1954-07-13",
      bceString: null,
    },
    questions: [
      "My software works, but does it speak to the human condition?",
      "What does this error feel like to you?",
      "Is a bug still a bug... if it’s beautiful?",
    ],
    avatar: FridaKahlo,
    panelImg: FridaKahlo_Panel,
    pronoun: "She",
    description: "Iconic Mexican painter known for her vivid self-portraits",
    answerStyle:
      "Would insist that your CI/CD pipeline needs to express raw emotion. Would also refuse to fix bugs because `imperfection is beauty.`",
  },
];
