import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PaymentTransaction } from "./payment-transaction.entities";
import { User } from "./user.entities";

@Entity({ name: "payment_proofs" })
export class PaymentProof {
    @PrimaryGeneratedColumn("uuid")
    proof_id!: string;

    @ManyToOne(() => PaymentTransaction)
    transaction!: PaymentTransaction;

    @ManyToOne(() => User)
    uploaded_by!: User; 

    @Column()
    file_path!: string;

    @Column()
    file_name!: string;

    @Column()
    mime_type!: string;

    @Column({ default: false })
    is_valid!: boolean;

    @Column({ nullable: true })
    rejection_reason!: string;

    @ManyToOne(() => User, { nullable: true })
    validated_by!: User;

    @CreateDateColumn()
    uploaded_at!: Date;

    @Column()
    updated_at!: Date;
}