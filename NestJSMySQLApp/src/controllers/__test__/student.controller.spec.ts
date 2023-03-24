import { Test } from "@nestjs/testing";
import { StudentService } from "src/services/student.service";
import { StudentController } from "src/controllers/student.controller";
import { Student } from "src/entities/student.entity";

describe("StudentController", () => {
  let controller: StudentController;
  let service: StudentService;

  const singleStudent = {
    id: 1,
    StId: "rapidx",
    StName: "rapidx",
  } as Student;

  const multipleStudents = [
    {
      id: 1,
      StId: "rapidx",
      StName: "rapidx",
    },
  ] as Student[];

  beforeEach(async () => {
    const mockService = {
      fetchAll: () => Promise.resolve(multipleStudents),
      fetchOne: (id: number) => Promise.resolve(singleStudent),
      create: (student: Student) => Promise.resolve(student),
      delete: (id: number) => Promise.resolve(singleStudent),
      update: (id: number, student: Partial<Student>) => Promise.resolve(student),
    };

    const module = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(StudentController);
    service = module.get(StudentService);
  });

  describe("fetchAll", () => {
    it("should fetch all students", async () => {
      const students = await controller.fetchAll();
      expect(students.length).toBeGreaterThan(0);
    });
  });

  describe("fetchOne", () => {
    it("should throw not found exception for the given id", async () => {
      service.fetchOne = (id: number) => Promise.resolve(null);
      await expect(controller.fetchOne("1")).rejects.toThrow();
    });

    it("should return one student for the given id", async () => {
      const student = await controller.fetchOne("1");
      expect(student.StId).toEqual(singleStudent.StId);
      expect(student.StName).toEqual(singleStudent.StName);
    });
  });

  describe("Create student", () => {
    it("should create a student", async () => {
      const student = await controller.create(singleStudent);
      expect(student.StId).toEqual(singleStudent.StId);
      expect(student.StName).toEqual(singleStudent.StName);
    });
  });

  describe("Update student", () => {
    it("should throw not found exception for the given id", async () => {
      service.update = (id: number, student: Partial<Student>) => Promise.resolve(null);
      await expect(controller.update("1", singleStudent)).rejects.toThrow();
    });

    it("should return one student for the given id", async () => {
      const student = await controller.update("1", singleStudent);
      expect(student.StId).toEqual(singleStudent.StId);
      expect(student.StName).toEqual(singleStudent.StName);
    });
  });

  describe("Delete student", () => {
    it("should throw not found exception for the given id", async () => {
      service.delete = (id: number) => Promise.resolve(null);
      await expect(controller.delete("1")).rejects.toThrow();
    });

    it("should return one student for the given id", async () => {
      const student = await controller.delete("1");
      expect(student.StId).toEqual(singleStudent.StId);
      expect(student.StName).toEqual(singleStudent.StName);
    });
  });
});
