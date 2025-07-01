export interface ComponentItem {
  id: string | number;
  name: string;
  description?: string;
  imageUrl?: string;
  // allow additional dynamic properties
  [key: string]: any;
}