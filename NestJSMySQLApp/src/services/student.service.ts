import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "src/entities/student.entity";
import { Repository } from "typeorm";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  fetchAll() {
    return this.studentRepo.find();
  }

  fetchOne(id: number) {
    return this.studentRepo.findOne({
      where: { id },
    });
  }

  create(student: Partial<Student>) {
    const newStudent = this.studentRepo.create(student);
    return this.studentRepo.save(newStudent);
  }

  async update(id: number, attrs: Partial<Student>) {
    const student = await this.fetchOne(id);

    if (!student) {
      return null;
    }

    Object.assign(student, attrs);
    return this.studentRepo.save(student);
  }

  async delete(id: number) {
    const student = await this.fetchOne(id);

    if (!student) {
      return null;
    }

    return this.studentRepo.remove(student);
  }
}
