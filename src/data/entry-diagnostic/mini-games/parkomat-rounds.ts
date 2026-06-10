export type ParkomatGate = "plus" | "minus";

export type ParkomatLexicalMarker =
  | "received"
  | "gave_more"
  | "found"
  | "bought"
  | "added"
  | "spent"
  | "lost"
  | "gave_away"
  | "taken_away"
  | "remained";

export type ParkomatRound = {
  id: string;
  text: string;
  correctGate: ParkomatGate;
  roundType: "story_to_operation";
  lexicalMarker: ParkomatLexicalMarker;
};

export const PARKOMAT_ROUNDS: ParkomatRound[] = [
  {
    id: "parkomat-001",
    text: "У МышМата было 8 жетонов. Ему дали ещё 3 жетона.",
    correctGate: "plus",
    roundType: "story_to_operation",
    lexicalMarker: "received",
  },
  {
    id: "parkomat-002",
    text: "У Сони было 12 наклеек. Она подарила 5 подруге.",
    correctGate: "minus",
    roundType: "story_to_operation",
    lexicalMarker: "gave_away",
  },
  {
    id: "parkomat-003",
    text: "В коробке лежало 10 карандашей. Мама положила туда ещё 4.",
    correctGate: "plus",
    roundType: "story_to_operation",
    lexicalMarker: "added",
  },
  {
    id: "parkomat-004",
    text: "У Дани было 15 карточек. Он потерял 6 карточек.",
    correctGate: "minus",
    roundType: "story_to_operation",
    lexicalMarker: "lost",
  },
  {
    id: "parkomat-005",
    text: "На полке стояло 9 книг. Поставили ещё 7 книг.",
    correctGate: "plus",
    roundType: "story_to_operation",
    lexicalMarker: "added",
  },
  {
    id: "parkomat-006",
    text: "У Маши было 14 конфет. Она съела 3 конфеты.",
    correctGate: "minus",
    roundType: "story_to_operation",
    lexicalMarker: "spent",
  },
  {
    id: "parkomat-007",
    text: "У ребят было 11 шариков. Они нашли ещё 2 шарика.",
    correctGate: "plus",
    roundType: "story_to_operation",
    lexicalMarker: "found",
  },
  {
    id: "parkomat-008",
    text: "В корзине было 18 яблок. Из неё взяли 4 яблока.",
    correctGate: "minus",
    roundType: "story_to_operation",
    lexicalMarker: "taken_away",
  },
];
