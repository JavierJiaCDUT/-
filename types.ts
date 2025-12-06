export interface Position {
  x: number;
  y: number;
}

export interface CardData {
  id: string;
  text: string;
  position: Position;
  timestamp: string;
  zIndex: number;
  isTyping: boolean; // True if the card is currently animating its text
}
