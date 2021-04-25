import { IResourceActionResult } from '@/typings';

export default class ResourceQueue {
  private processResourceMap = new Map<number, IResourceActionResult[]>();
  private processIngMap = new Map<number, boolean>();
  private callback: (target: IResourceActionResult) => void;
  private startCallback: (id: number) => void;
  private finishCallback: (id: number) => void;

  public setCallback(fn: (target: IResourceActionResult) => void) {
    this.callback = fn;
  }

  public add(id: number, resourceActionInfo: IResourceActionResult): void {
    const currentLibraryList = this.processResourceMap.get(id);
    if (!currentLibraryList) {
      this.processResourceMap.set(id, [resourceActionInfo]);
    } else {
      currentLibraryList.push(resourceActionInfo);
    }
  }

  public run(id: number) {
    if (this.processIngMap.get(id)) return;

    this.processIngMap.set(id, true);
    this.loop(id);
    this.startCallback(id);
  }

  public onStart(fn: (id: number) => void) {
    this.startCallback = fn;
  }

  public onFinish(fn: (id: number) => void) {
    this.finishCallback = fn;
  }

  private loop(id: number) {
    const currentProcessList = this.processResourceMap.get(id);

    const handleOne = async () => {
      const target = currentProcessList[0];
      if(!target) {
        this.processIngMap.set(id, false);
        this.finishCallback(id);
        return;
      }

      await this.callback(target);

      currentProcessList.shift();
      handleOne();
    };

    handleOne();
  }
}
