import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true }) // Omogućujemo null vrijednost
  refreshToken: string | null;

  @Column()
  role: string; // ✅ Dodano polje koje fali
}
