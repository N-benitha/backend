import { ChangeRequest } from "src/change-request/entities/change-request.entity";
import { UserProject } from "src/user-project/entities/user-project.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("projects")
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @OneToMany(() => ChangeRequest, (changeRquest) => changeRquest.project)
    changeRequests: ChangeRequest[];

    @OneToMany(() => UserProject, (userProject) => userProject.project)
    userProjects: UserProject[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
