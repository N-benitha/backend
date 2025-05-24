import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('user-projects')
export class UserProject {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.userProjects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Project, (project) => project.userProjects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId'})
    project: Project;

    @CreateDateColumn()
    assigned_at: Date;
}
