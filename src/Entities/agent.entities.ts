import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entities";

@Entity()
export class Agent {
    @PrimaryGeneratedColumn("uuid")
    agent_id!: string;

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id"})
    user!: User;

    @Column()
    code!: string

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    contact_person!: string;

    @Column()
    address_line1!: string;

    @Column()
    address_line2!: string;

    @Column()
    city!: string;

    @Column()
    contact_number!: string;

    @Column()
    state_origin!: string;

    @Column()
    country!: string;

    @Column()
    commission_percent!: number;

    @Column()
    is_active!: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}