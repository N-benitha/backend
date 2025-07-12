import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RequestType } from "./enums/request-type.enum";
import { RequestStatus } from "./enums/request-status.enum";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";

@Entity('change-requests')
export class ChangeRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 100})
    description: string;

    @ManyToOne(() => Project, (project) => project.changeRequests, { onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => User, (user) => user.changeRequests, { onDelete: 'CASCADE' })
    user: User;

    @Column({
        type: 'enum',
        enum: RequestType,
        default: RequestType.NEW_FEATURE
    })
    request_type: RequestType;

    @Column({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.PENDING
    })
    status: RequestStatus;

    @Column({ nullable: true})
    deployment_date: Date;

    @Column({
        type: 'text',
        nullable: true
    })
    reason?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
