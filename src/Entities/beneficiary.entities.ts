import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "beneficiairies" })
export class Beneficiary {
    @PrimaryGeneratedColumn("uuid")
    beneficiary_id!: string;

    @Column()
    beneficiary_type!: string;

    @Column()
    name!: string;

    @Column()
    swift_code!: string;

    @Column()
    bank_name!: string;

    @Column()
    account_number!: string;

    @Column({ nullable: true})
    routing_number!: string;

    @Column()
    contact_email!: string;

    @Column()
    contact_phone!: string;

    @Column()
    address_line1!: string;

    @Column({ nullable: true })
    address_line2!: string;

    @Column()
    city!: string;

    @Column()
    province_state!: string;

    @Column()
    country!: string;

    @Column({ default: true })
    is_active!: boolean;

    @CreateDateColumn()
    created_at!: Date;
}







    // @ManyToOne(() => Agent)
    // @JoinColumn({ name: "agent_id"})
