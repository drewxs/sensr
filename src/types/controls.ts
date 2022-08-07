export enum ControlType {
  USER = 'USER',
  NPC = 'NPC',
  AI = 'AI',
}

export class Controls {
  left: boolean;
  right: boolean;
  forward: boolean;
  reverse: boolean;

  constructor(type: ControlType) {
    this.left = false;
    this.right = false;
    this.forward = false;
    this.reverse = false;

    switch (type) {
      case ControlType.USER:
        this.addKeyboardListeners();
        break;
      case ControlType.NPC:
        this.forward = true;
        break;
    }
  }

  /**
   * Add keyboard listeners for car controls.
   */
  addKeyboardListeners(): void {
    document.onkeydown = (e): void => {
      switch (e.key) {
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
        case 'ArrowUp':
          this.forward = true;
          break;
        case 'ArrowDown':
          this.reverse = true;
          break;
      }
    };

    document.onkeyup = (e): void => {
      switch (e.key) {
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
        case 'ArrowUp':
          this.forward = false;
          break;
        case 'ArrowDown':
          this.reverse = false;
          break;
      }
    };
  }
}
