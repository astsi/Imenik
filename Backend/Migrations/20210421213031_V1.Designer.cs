﻿// <auto-generated />
using System;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Backend.Migrations
{
    [DbContext(typeof(ImenikContext))]
    [Migration("20210421213031_V1")]
    partial class V1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.5")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Backend.Models.Kontakt", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ID")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ime")
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)")
                        .HasColumnName("Ime");

                    b.Property<string>("opis")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)")
                        .HasColumnName("Opis");

                    b.Property<string>("prezime")
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)")
                        .HasColumnName("Prezime");

                    b.Property<string>("tip")
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)")
                        .HasColumnName("Tip");

                    b.HasKey("id");

                    b.ToTable("Kontakti");
                });

            modelBuilder.Entity("Backend.Models.Telefon", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ID")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("broj")
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)")
                        .HasColumnName("Broj");

                    b.Property<int?>("kontaktid")
                        .HasColumnType("int");

                    b.Property<string>("tip")
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)")
                        .HasColumnName("Tip");

                    b.HasKey("id");

                    b.HasIndex("kontaktid");

                    b.ToTable("Telefoni");
                });

            modelBuilder.Entity("Backend.Models.Telefon", b =>
                {
                    b.HasOne("Backend.Models.Kontakt", "kontakt")
                        .WithMany("listaTelefona")
                        .HasForeignKey("kontaktid");

                    b.Navigation("kontakt");
                });

            modelBuilder.Entity("Backend.Models.Kontakt", b =>
                {
                    b.Navigation("listaTelefona");
                });
#pragma warning restore 612, 618
        }
    }
}
