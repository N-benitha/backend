import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("projects")
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
