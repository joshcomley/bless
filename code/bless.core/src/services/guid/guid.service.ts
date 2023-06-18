/* eslint-disable no-bitwise */
export class GuidService {
  private static Lut: Array<any> | null = null;
  public static Empty: string = "00000000-0000-0000-0000-000000000000";

  public static New(separator: string = "-"): string {
    if (!GuidService.Lut) {
      GuidService.Lut = new Array<any>();
      for (let i = 0; i < 256; i++) {
        GuidService.Lut[i] = (i < 16 ? "0" : "") + i.toString(16);
      }
    }
    const lut = GuidService.Lut;
    const d0 = (Math.random() * 0xffffffff) | 0;
    const d1 = (Math.random() * 0xffffffff) | 0;
    const d2 = (Math.random() * 0xffffffff) | 0;
    const d3 = (Math.random() * 0xffffffff) | 0;
    return (
      lut[d0 & 0xff] +
      lut[(d0 >> 8) & 0xff] +
      lut[(d0 >> 16) & 0xff] +
      lut[(d0 >> 24) & 0xff] +
      separator +
      lut[d1 & 0xff] +
      lut[(d1 >> 8) & 0xff] +
      separator +
      lut[((d1 >> 16) & 0x0f) | 0x40] +
      lut[(d1 >> 24) & 0xff] +
      separator +
      lut[(d2 & 0x3f) | 0x80] +
      lut[(d2 >> 8) & 0xff] +
      separator +
      lut[(d2 >> 16) & 0xff] +
      lut[(d2 >> 24) & 0xff] +
      lut[d3 & 0xff] +
      lut[(d3 >> 8) & 0xff] +
      lut[(d3 >> 16) & 0xff] +
      lut[(d3 >> 24) & 0xff]
    );
  }

  public newGuid(): string {
    return GuidService.New();
  }
}
