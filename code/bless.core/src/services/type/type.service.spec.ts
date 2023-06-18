import { TypeService } from "./type.service";

class MyClass {
  public someField: string;

  public get someProperty(): string {
    return this.someField;
  }
}
describe("TypeService", () => {
  let service: TypeService<MyClass>;

  it("should be created", () => {
    service = new TypeService(new MyClass());
    expect(service).toBeTruthy();
  });

  it("should find properties from object", () => {
    service = new TypeService(new MyClass());
    expect(service).toBeTruthy();
    const getters = service.propertiesAndFields;
    expect(getters.length).toBe(1);
    expect(getters[0]).toBe("someProperty");
  });

  it("should find properties and fields from object", () => {
    service = new TypeService(new MyClass());
    expect(service).toBeTruthy();
    service.object.someField = "abc";
    const getters = service.propertiesAndFields;
    expect(getters.length).toBe(2);
    expect(getters[0]).toBe("someProperty");
    expect(getters[1]).toBe("someField");
  });

  it("should find properties from type", () => {
    service = new TypeService(MyClass);
    expect(service).toBeTruthy();
    const getters = service.propertiesAndFields;
    expect(getters.length).toBe(1);
    expect(getters[0]).toBe("someProperty");
  });
});
