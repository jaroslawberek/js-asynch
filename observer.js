class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, obj, callback, isOnce = false) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push({ obj, callback, isOnce });
    //console.log(this.listeners);
  }
  once(event, obj, callback) {
    this.on(event, obj, callback, true);
  }
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((l) => l.callback !== callback);
  }

  emit(event, args) {
    if (!this.listeners[event]) return;
    const current = [...this.listeners[event]];
    current.forEach(async (listener) => {
      try {
        const result = listener.callback.call(listener.obj, args);
        if (result instanceof Promise) await result;
        if (listener.isOnce) this.off(event, listener.callback);
      } catch (err) {
        if (event !== "error") {
          this.emit("error", { event, err });
        } else {
          console.error("[EventEmitter] Błąd w listenerze błędu:", err);
        }
      }
    });
    // console.log(this.listeners);
  }
}

class Player extends EventEmitter {
  constructor(x, y, height, width) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.status = "plaing";
    this.on("error", (err) => console.warn("Wystąpił błąd:", err));
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    this.emit("changePosition", { x: this.x, y: this.y });
  }
  setStatus(newStatus) {
    const oldStatus = this.status;
    this.status = newStatus;
    this.emit("changeStatus", { oldStatus: oldStatus, newStatus: this.status });
  }
}
class Hud {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.playerPosition = { x: null, y: null };

    this.onPlayerPositionChange = function (args) {
      //throw new Error("Nie mogę zaktualizować zmiany pozycji!");
      this.playerPosition.x = args.x;
      this.playerPosition.y = args.y;
      this.draw();
    };

    this.onChangeStatus = function (args) {
      throw new Error("Nie mogę zaktualizować statusu!");
      console.log("Change Status: " + args.oldStatus + " zmieniono na " + args.newStatus);
    };
  }

  draw() {
    console.log(`Player position x: ${this.playerPosition.x} position y: ${this.playerPosition.y}`);
  }
}

const p = new Player(20, 10, 100, 100);
const h = new Hud(0, 0, 100, 50);
console.clear();
p.on("changePosition", h, h.onPlayerPositionChange);
p.once("changeStatus", h, h.onChangeStatus);

p.move(80, 110);
p.setStatus("die");
