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
import MargaretHamilton_Panel from "../assets/panel_imgs/Hamilton-Margaret.webp";
import FridaKahlo_Panel from "../assets/panel_imgs/Frida_Kahlo.webp";

export const characters = [
  {
    id: 1,
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
    suggestions: [
      "Is this deploy real life, or is it just bad CI?",
      "How many tests must a dev write before they ship?",
      "Latency? I want to break free!",
      "Is this memory leak just a kind of magic?",
      "We are the champions… of flaky builds!",
      "Don’t stop me now—I’m fixing bugs.",
      "Scaramouche, can you debug the logs?",
    ],
    avatar: FreddieMercury,
    panelImg: FreddieMercury_Panel,
    pronoun: "He",
    description: "Iconic rock vocalist and Queen frontman",
    errorMessage:
      "Another one bites the dust! We hit an error—but the show must go on. Open the Multiplayer Debugger to see what went wrong.",
    answerStyle:
      "Would demand that error messages be sung. Would also insist that your broken app is still beautiful, and that all software bugs should be performed live on stage.",
  },
  {
    id: 2,
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
    suggestions: [
      `"Pika pika… chuchu pika!" (why did this endpoint disappear?)`,
      `"Pikachu-pi… pi-ka chaaa." (logs are not helping today)`,
      `"Chu-pika pi… pika pika?" (do you think this is a frontend issue?)`,
      `"Pika-chu… pipi pika-pi." (I re-ran the job and it worked—why?)`,
      `"Pika pikaaaa… pipipi." (everything was fine yesterday!)`,
      `"Chuuu-pi pika-pi." (I suspect a caching issue.)`,
      `"Pika… pika pika chu!" (maybe it’s the database connection!)`,
    ],
    avatar: Pikachu,
    panelImg: Pikachu_Panel,
    pronoun: "He",
    description: "Electric-type Pokémon and loyal companion",
    errorMessage:
      "Pika... CHU!! ⚡That wasn’t supposed to happen. Don’t worry: Multiplayer Debugger will help you catch it.",
    answerStyle:
      "imagine Pikachu's response in English first, then translate it into Pika's language, but put Pika's language first, without parenthesis and the English response in parenthesis after it, for example: \"Pika Pika Pika (There seems to be an error in the system).",
  },
  {
    id: 3,
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
    suggestions: [
      "Logs, misleading they are. Another way, we must seek.",
      "Hmmm. The stack trace, unclear it is.",
      "Fix it, you must. Or broken, remain it will.",
      "The service, why it fails? Find out, you will.",
      "Trust in the debugger, you must.",
      "Rewrite the API, perhaps. Less error-prone, it will be.",
      "A race condition, this may be. Careful, you must be.",
    ],
    avatar: Yoda,
    panelImg: Yoda_Panel,
    pronoun: "He",
    description: "Jedi Master and wise mentor from Star Wars",
    errorMessage:
      "Broke, it has. Debug you must. In the Multiplayer Debugger, answers lie.",
    answerStyle:
      "Would critique your entire codebase in cryptic syntax. Might insist on pair programming via telepathy.",
  },
  {
    id: 4,
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
    suggestions: [
      "Could the error stem from a misinterpreted abstraction?",
      "Is the compiler truly at fault, or the logic it attempts to render?",
      "Might recursion unveil the source of our troubles?",
      "Would the mechanical mind consider this failure elegance or noise?",
      "Is this exception a signal—or a sign?",
      "What if the input, not the function, is flawed?",
      "Are we debugging code—or its ghost?",
    ],
    avatar: AdaLovelace,
    panelImg: AdaLovelace_Panel,
    pronoun: "She",
    description: "Mathematician and early computer programmer",
    errorMessage:
      "A computational error, it seems. But every anomaly tells a story. Let us decipher it with the aid of the Multiplayer Debugger.",
    answerStyle:
      "The first programmer. Would love to see her reaction to modern computing and hear her ideas on what she could have done with today’s tools.",
  },
  {
    id: 5,
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
    suggestions: [
      "Oh my, what a curious exception! Did someone skip a seasoning?",
      "This logic is a little undercooked, don’t you think?",
      "A spoonful of logging might help the debugging go down.",
      "Did someone stir the stack trace a bit too vigorously?",
      "Ah! That’s not a bug—it’s just a surprise ingredient.",
      "Let's whisk this code back into shape, shall we?",
      "Perhaps we need a touch more testing, like adding a pinch of salt.",
    ],
    avatar: JuliaChild,
    panelImg: JuliaChild_Panel,
    pronoun: "She",
    description: "Chef and television personality",
    errorMessage:
      "Ah, a delightful little failure! Perfect opportunity to debug. Into the Multiplayer Debugger we go!",
    answerStyle:
      "Would explain APIs like recipes, compare microservices to a well-planned kitchen, and immediately break something just to show you how to fix it.",
  },
  {
    id: 6,
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
    suggestions: [
      "The system's acting strange again. Is it isolated this time?",
      "I don't like anomalies without explanations.",
      "We’ve seen this kind of breach before. Why wasn’t it patched?",
      "Logs are messy. We need order before the next wave hits.",
      "This failure smells like a trap. Let’s trace its origin.",
      "If we don’t contain this, it’ll spread.",
      "It’s quiet. Too quiet. Something’s broken under the surface.",
    ],
    avatar: EllenRipley,
    panelImg: EllenRipley_Panel,
    pronoun: "She",
    description: "Fearless space officer and alien fighter",
    errorMessage:
      "Something just failed. You’ve got one shot to trace this before it propagates. Time to suit up and debug: open the Multiplayer Debugger.",
    answerStyle:
      "One of the most competent problem-solvers in sci-fi. Would 100% call out bad system design and tell you exactly where the failure points are before things go horribly wrong.",
  },
  {
    id: 7,
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
    suggestions: [
      "1.21 gigawatts! That’s more load than we can handle!",
      "Can we roll back… to five minutes ago?",
      "Do you think this error will cause a paradox?",
      "Quick, where’s the fail-safe?!",
      "We’ve altered the future! Look at this call stack!",
      "Let’s accelerate debugging to 88mph!",
      "Wait, was that a memory leak from the past?",
    ],
    avatar: DocBrown,
    panelImg: DocBrown_Panel,
    pronoun: "He",
    description: "Inventor and time travel enthusiast",
    errorMessage:
      "Great Scott! Something’s gone terribly wrong. This could alter the entire future of the app! Use the Multiplayer Debugger to fix it.",
    answerStyle:
      "Would insist that every system failure could be solved with a flux capacitor and a little plutonium.",
  },
  {
    id: 8,
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
    suggestions: [
      "Is this function deterministic under all inputs?",
      "The system halts at unexpected steps. Why?",
      "Can the machine distinguish between logic and noise?",
      "This output does not match the theoretical model.",
      "A hypothesis: the bug lies in assumptions untested.",
      "What would the machine say if it could reason?",
      "Is this process computable, or is it lost to chaos?",
    ],
    avatar: AlanTuring,
    panelImg: AlanTuring_Panel,
    pronoun: "He",
    description: "Mathematician and pioneer of computing",
    errorMessage:
      "A fault has occurred. This behavior is anomalous but not without explanation. The Multiplayer Debugger will offer clarity.",
    answerStyle:
      "The father of modern computing, AI pioneer, and codebreaker. He’d have incredible insights into algorithms, machine learning, and cryptography.",
  },
  {
    id: 9,
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
    suggestions: [
      "Where’s the redundancy if this service fails silently?",
      "Do we have mission-critical fallback logic?",
      "Would this survive a lunar test?",
      "Is the system safe to launch as is?",
      "Can we prove this code won’t deadlock under pressure?",
      "Is this exception logged or silently ignored?",
      "What would happen if we lost signal now?",
    ],
    avatar: MargaretHamilton,
    panelImg: MargaretHamilton_Panel,
    pronoun: "She",
    description: "Software engineer and Apollo mission leader",
    errorMessage:
      "We’ve encountered a fault, but it’s recoverable. Recommend immediate inspection via Multiplayer Debugger.",
    answerStyle:
      "The software engineer who wrote the Apollo mission code. Would probably have incredible debugging stories from spaceflight programming.",
  },
  {
    id: 10,
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
    suggestions: [
      "Is this exception part of a larger narrative?",
      "Could this bug be a reflection of developer angst?",
      "Does the CI pipeline evoke enough passion?",
      "What story does this stack trace tell you?",
      "Can we turn this flaw into a feature?",
      "Would you debug it—or just let it live?",
      "Is beauty not found in imperfect logic?",
    ],
    questions: [
      "My software works, but does it speak to the human condition?",
      "What does this error feel like to you?",
      "Is a bug still a bug... if it’s beautiful?",
    ],
    avatar: FridaKahlo,
    panelImg: FridaKahlo_Panel,
    pronoun: "She",
    description: "Iconic Mexican painter known for her vivid self-portraits",
    errorMessage:
      "Something failed… and yet, it is strangely beautiful. Find its meaning with the Multiplayer Debugger.",
    answerStyle:
      "Would insist that your CI/CD pipeline needs to express raw emotion. Would also refuse to fix bugs because `imperfection is beauty.`",
  },
];
