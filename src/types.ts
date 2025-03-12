export interface ClassEvent {
  id: string;
  courseName: string;
  professor: string;
  room: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
}