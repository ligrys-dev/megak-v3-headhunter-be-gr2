import { Recruiter } from 'src/modules/hr-recruiter/entities/hr-recruiter.entity';
import { StudentInitial } from 'src/modules/student/entities/student-initial.entity';
import { Role } from 'src/types';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  role: Role;

  @Column({ nullable: false })
  pwdHash: string;

  @Column({ default: false, nullable: false })
  isActive: boolean;

  @Column({ nullable: true, default: () => 'uuid()' })
  activationToken: string | null;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => Recruiter, (recruiter) => recruiter.id)
  @JoinColumn()
  recruiter: Recruiter;

  @OneToOne(() => StudentInitial, (student) => student.email)
  @JoinColumn()
  student: StudentInitial;

  [key: string]: any;
}
