import { Injectable } from '@nestjs/common';
import { CreateStudentProfileDto } from './dto/create-studentProfile.dto';
import { UpdateStudentProfileDto } from './dto/update-studentProfile.dto';
import { StudentProfile } from './entities/student-profile.entity';
import { StudentInitial } from './entities/student-initial.entity';
import {
  GetOneStudentProfileResponse,
  ListOfStudentProfilesResponse,
  StudentInitialEntity,
  StudentProfileEntity,
  StudentStatus,
} from 'src/types';
import { CreateStudentInitialDto } from './dto/create-studentInitial.dto';
import { InvalidDataFormatException } from '../../common/exceptions/invalid-data-format.exception';

@Injectable()
export class StudentService {
  async findAllInitialProfile() {
    return StudentInitial.find();
  }

  async findOneInitialProfile(email: string) {
    return StudentInitial.findOneOrFail({
      where: { email },
    });
  }

  async findAllProfiles(): Promise<ListOfStudentProfilesResponse> {
    return StudentProfile.find({
      relations: ['initialData'],
    });
  }

  async findOneProfile(id: string): Promise<GetOneStudentProfileResponse> {
    return StudentProfile.findOneOrFail({
      where: { id },
      relations: ['initialData'],
    });
  }

  async createStudentProfile(
    createStudentDto: CreateStudentProfileDto,
  ): Promise<StudentProfileEntity> {
    const newStudent: CreateStudentProfileDto = new StudentProfile();

    Object.keys(createStudentDto).forEach((prop) => {
      newStudent[prop] = createStudentDto[prop];
    });
    newStudent.status = StudentStatus.AVAILABLE;

    const checkGitHubUsername = await fetch(
      `https://api.github.com/users/${newStudent.githubUsername}`,
    );
    const res = await checkGitHubUsername.json();

    if (res.message === 'Not Found' && newStudent.githubUsername !== '') {
      throw new InvalidDataFormatException('GitGub user does not exist');
    }

    await newStudent.save();
    return newStudent;
  }

  async createInitialProfile(
    initialProfile: CreateStudentInitialDto,
  ): Promise<StudentInitialEntity> {
    const newInitialProfile: CreateStudentInitialDto = new StudentInitial();

    Object.keys(initialProfile).forEach((prop) => {
      newInitialProfile[prop] = initialProfile[prop];
    });

    await newInitialProfile.save();
    return newInitialProfile;
  }

  async updateStudentProfile(
    id: string,
    updateStudentDto: UpdateStudentProfileDto,
  ): Promise<UpdateStudentProfileDto> {
    const updatingStudent: UpdateStudentProfileDto =
      await this.findOneProfile(id);

    Object.keys(updateStudentDto).forEach((prop) => {
      updatingStudent[prop] = updateStudentDto[prop];
    });

    await updatingStudent.save();
    return updatingStudent;
  }
}
