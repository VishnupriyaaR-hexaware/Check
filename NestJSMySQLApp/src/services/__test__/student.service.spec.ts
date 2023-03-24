import { Student } from "src/entities/student.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { StudentService } from "src/services/student.service";
import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";

describe("StudentService", () => {
  let service: StudentService;
  let repo: Repository<Student>;

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
    const mockRepo = {
      find: () => Promise.resolve(multipleStudents),
      findOne: (id: number) => Promise.resolve(singleStudent),
      save: (student: Student) => Promise.resolve(student),
      create: (student: Student) => student,
      remove: (student: Student) => Promise.resolve(student),
    };

    const module = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get(StudentService);
    repo = module.get(getRepositoryToken(Student));
  });

  it("should be defined", async () => {
    expect(service).toBeDefined();
  });

  describe("fetchAll", () => {
    it("should fetch all students from database", async () => {
      const students = await service.fetchAll();
      expect(students.length).toBeGreaterThan(0);
    });
  });

  describe("fetchOne", () => {
    it("should fetch one student from the database", async () => {
      const student = await service.fetchOne(1);
      expect(student.StId).toEqual(singleStudent.StId);
      expect(student.StName).toEqual(singleStudent.StName);
    });
    it("should fetch no students from database", async () => {
      repo.findOne = () => Promise.resolve(null);
      const student = await service.fetchOne(1);
      expect(student).toBeNull();
    });
  });

  describe("Create student", () => {
    it("should create the student of the specified values", async () => {
      const student = await service.create(singleStudent);
      expect(student.StId).toEqual(singleStudent.StId);
      expect(student.StName).toEqual(singleStudent.StName);
    });
  });

  describe("Update student", () => {
    it("should return null when student is not available", async () => {
      repo.findOne = () => Promise.resolve(null);
      const student = await service.update(1, {});
      expect(student).toBeNull();
    });

    it("should update the student of the specified id", async () => {
      const student = await service.update(1, singleStudent);
      expect(student.StId).toEqual(singleStudent.StId);
      expect(student.StName).toEqual(singleStudent.StName);
    });
  });

  describe("Delete student", () => {
    it("should return null when student is not available", async () => {
      repo.findOne = () => Promise.resolve(null);
      const student = await service.delete(1);
      expect(student).toBeNull();
    });

    it("should delete the student of the specified id", async () => {
      const student = await service.delete(1);
      expect(student.id).toEqual(1);
    });
  });
});
