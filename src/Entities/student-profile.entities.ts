import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Agent } from "./agent.entities";

@Entity({ name: "student_profiles"})
export class StudentProfile {
    @PrimaryGeneratedColumn("uuid")
    student_id!: string;

    @ManyToOne(() => Agent )
    agent! : Agent;

    @Column()
    full_name!: string;

    @Column()
    phone_number!: string;

    @Column()
    address_line1!: string;

    @Column()
    address_line2!: string; 

    @Column()
    city!: string;

    @Column()
    state_origin!: string;

    @Column()
    country!: string;

    @Column()
    date_of_birth!: Date;

    @CreateDateColumn()
    created_at!: Date;

}