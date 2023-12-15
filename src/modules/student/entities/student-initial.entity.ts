import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { StudentStatus } from 'src/types';
import { StudentProfile } from './student-profile.entity';
import { Recruiter } from 'src/modules/hr-recruiter/entities/hr-recruiter.entity';

@Entity()
export class StudentInitial extends BaseEntity {
  @PrimaryColumn()
  email: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: false })
  courseCompletion: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: false })
  courseEngagement: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: false })
  projectDegree: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: false })
  teamProjectDegree: number;

  @Column('simple-array')
  bonusProjectUrls: string[];

  @Column({ type: 'enum', enum: StudentStatus, default: 0 })
  status: StudentStatus;

  @Column({ type: 'datetime', nullable: true })
  reservationExpirationDate: Date | null;

  @OneToOne(() => StudentProfile, (profile) => profile.initialData, {
    eager: true,
  })
  profile: StudentProfile | null;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.reservedStudents)
  recruiter: Recruiter | null;

  [key: string]: any;
}
