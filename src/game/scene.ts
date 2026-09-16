import Phaser from 'phaser';
import frames from './frames.json';
import type { Customer } from '../content';

const images = import.meta.glob([
  '../../Img/Assets/Characters/*.png', '../../Img/Assets/Props/*.png',
  '../../Img/Assets/Portraits/customer-{tan-hat,redhead,red-beret}-portrait.png',
  '../../Img/Assets/Environment/post-office-gameplay-room-v2.png',
  '../../Img/Assets/Environment/post-office-service-counter.png',
  '!../../Img/Assets/Characters/customer-olive-jacket-sheet.png',
], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
export function asset(path: string) { return images[`../../Img/Assets/${path}`]; }

export class PostalScene extends Phaser.Scene {
  private robot!: Phaser.GameObjects.Image;
  private clerk!: Phaser.GameObjects.Image;
  private customer!: Phaser.GameObjects.Image;
  private people: Phaser.GameObjects.Image[] = [];
  private readonly home = { x: 670, y: 610 };
  private readyResolve!: () => void;
  readonly ready = new Promise<void>(resolve => { this.readyResolve = resolve; });
  constructor() { super('post'); }
  preload() {
    for (const path of Object.keys(frames)) this.load.image(path, asset(path));
    this.load.image('room', asset('Environment/post-office-gameplay-room-v2.png'));
  }
  create() {
    for (const [path, rectangles] of Object.entries(frames)) {
      rectangles.forEach(([x, y, width, height], i) => this.textures.get(path).add(i, 0, x, y, width, height));
    }
    this.add.image(0, 0, 'room').setOrigin(0).setDisplaySize(1310, 1200);
    for (const [name, x] of [['A1', 389], ['A2', 710], ['B1', 1030]] as const) {
      this.add.text(x, 223, name, { fontFamily: 'monospace', fontSize: '34px', color: '#352328', fontStyle: 'bold' }).setOrigin(.5);
    }
    this.clerk = this.figure('Characters/postal-clerk-female-sheet.png', 0, 510, 703, 205);
    this.figure('Characters/postal-mentor-sheet.png', 0, 855, 703, 208);
    this.figure('Environment/post-office-service-counter.png', 0, 655, 830, 202).setDisplaySize(900, 202);
    this.figure('Props/post-office-clerk-workstation.png', 0, 465, 686, 92).setDisplaySize(165, 92);
    this.figure('Props/post-office-instructor-workstation.png', 0, 892, 686, 100).setDisplaySize(190, 100);
    this.robot = this.figure('Characters/postal-robot-empty-8-directions.png', 0, this.home.x, this.home.y, 140);
    this.customer = this.figure('Characters/customer-tan-hat-sheet.png', 15, 666, 915, 218);
    this.people = [
      this.figure('Characters/customer-redhead-sheet.png', 15, 490, 1080, 190),
      this.figure('Characters/customer-red-beret-sheet.png', 15, 490, 1220, 178),
    ];
    this.readyResolve();
  }
  private figure(key: string, frame: number, x: number, y: number, height: number) {
    const object = this.add.image(x, y, key, frame).setOrigin(.5, 1);
    return object.setScale(height / object.height);
  }
  async setClerk(gender: 'female' | 'male') {
    await this.ready;
    this.clerk.setTexture(`Characters/postal-clerk-${gender}-sheet.png`, 0).setScale(205 / this.clerk.height);
  }
  async setCustomer(customer: Customer, next: Customer[] = []) {
    await this.ready;
    this.customer.setTexture(`Characters/customer-${customer}-sheet.png`, 15).setScale(210 / this.customer.height);
    this.people.forEach((person, i) => {
      person.setVisible(Boolean(next[i]));
      if (next[i]) person.setTexture(`Characters/customer-${next[i]}-sheet.png`, 15).setScale(185 / person.height);
    });
  }
  private robotPose(key: 'empty' | 'loaded' | 'pickup', frame: number, mirror = false) {
    const path = key === 'pickup' ? 'Characters/postal-robot-pickup-west-sheet.png' : `Characters/postal-robot-${key}-8-directions.png`;
    this.robot.setTexture(path, frame).setFlipX(mirror).setScale(140 / this.robot.height);
  }
  private pause(duration: number) {
    return new Promise<void>(resolve => this.time.delayedCall(duration, resolve));
  }
  private move(x: number, y: number, oldDuration: number, arriving = false) {
    // Twice the previous travel time, easing only at pickup/handoff endpoints.
    return new Promise<void>(resolve => this.tweens.add({ targets: this.robot, x, y, duration: oldDuration * 2, ease: arriving ? 'Sine.easeOut' : 'Linear', onComplete: () => resolve() }));
  }
  private async pickup(mirror: boolean, reverse = false) {
    for (const frame of reverse ? [3, 2, 1, 0] : [0, 1, 2, 3]) {
      this.robotPose('pickup', frame, mirror);
      await this.pause(110);
    }
  }
  async deliver(shelf: string, correct: boolean, golden = false) {
    await this.ready;
    // All vertical legs are in visible aisles; horizontal travel stays below shelves.
    const lane = shelf === 'B1' ? 1160 : 550;
    const mirror = shelf === 'A2';
    this.robotPose('empty', lane < this.home.x ? 2 : 6);
    await this.move(lane, 570, 140);
    this.robotPose('empty', 4);
    await this.move(lane, 360, 150, true);
    await this.pickup(mirror);
    this.robotPose('loaded', 0);
    if (golden) this.robot.setTint(0xffe3a2);
    await this.move(lane, 570, 150);
    this.robotPose('loaded', lane < this.home.x ? 6 : 2);
    await this.move(this.home.x, this.home.y, 140, true);
    // Stop beside the selected clerk for a readable handoff, not at the far wall.
    this.robotPose('loaded', 2);
    await this.pause(360);
    if (!correct) {
      this.robotPose('loaded', lane < this.home.x ? 2 : 6);
      await this.move(lane, 570, 140);
      this.robotPose('loaded', 4);
      await this.move(lane, 360, 150, true);
      await this.pickup(mirror, true);
      this.robot.clearTint(); this.robotPose('empty', 0);
      await this.move(lane, 570, 150);
      this.robotPose('empty', lane < this.home.x ? 6 : 2);
      await this.move(this.home.x, this.home.y, 140, true);
    }
    this.robot.clearTint(); this.robotPose('empty', 0);
  }
}

export function mountScene(parent: HTMLElement) {
  const scene = new PostalScene();
  const game = new Phaser.Game({
    type: Phaser.AUTO, parent, width: 1310, height: 1200,
    backgroundColor: '#b09162', pixelArt: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene, audio: { noAudio: true }, render: { antialias: false },
  });
  const observer = new ResizeObserver(() => game.scale.refresh());
  observer.observe(parent);
  return { scene, game, observer };
}
