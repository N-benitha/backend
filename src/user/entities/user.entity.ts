import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserStatus } from "./enums/user-status.enum";
import { UserType } from "./enums/user-type.enum";
import { ChangeRequest } from "src/change-request/entities/change-request.entity";
import { UserProject } from "src/user-project/entities/user-project.entity";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 15})
    username: string;

    @Column({unique: true})
    email: string;

    @Column({type: 'varchar'})
    password:string;

    @Column({
        type: 'enum',
        enum: UserType,
        nullable: true,
    })
    user_type: UserType;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING
    })
    status: UserStatus;

    @OneToMany(() => ChangeRequest, (changeRequest) => changeRequest.user)
    changeRequests: ChangeRequest[];

    @OneToMany(() => UserProject, (userProject) => userProject.user)
    userProjects: UserProject[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}