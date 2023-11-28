import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  // JoinColumn,
  // OneToOne,
} from 'typeorm';
// import { StudentProfile } from './student-profile.entity';
// todo relacja

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

  // @OneToOne(() => StudentProfile, (profile) => profile.id)
  // @JoinColumn()
  // profile: StudentProfile;
}