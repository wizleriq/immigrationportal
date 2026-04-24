import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "forex_rate_quote"})
export class ForexRateQuote {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    base_currency!: string;

    @Column()
    target_currency!: string;
    @Column("decimal", { precision: 10, scale: 4 })
    rate!: number;

    @Column("float")
    fx_rate!: number;

    @Column('float')
    service_fee_percent!: number;

    @Column('float')
    flat_fee_amount!: number;

    @CreateDateColumn()
    created_at!: Date; 
    
    @Column()
    expires_at!: Date;

    @Column({ type: "timestamp", nullable: true })
    updated_at!: Date;

}