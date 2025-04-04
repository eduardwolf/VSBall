export class GameObject {
    id: string;
    x: number;
    y: number;
    image: HTMLImageElement;
  
    constructor(id: string, x: number = 0, y: number = 0) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.image = this.getImageElement(id);
    }
  
    protected getImageElement(id: string): HTMLImageElement {
      const element = document.getElementById(id);
      if (!(element instanceof HTMLImageElement)) {
        throw new Error(`Element with ID ${id} is not a valid HTMLImageElement`);
      }
      return element;
    }
  }