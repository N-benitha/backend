import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserStatus } from "./enums/user-status.enum";
import { UserType } from "./enums/user-type.enum";

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
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}