BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [birthDate] DATETIME2 NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[Car] (
    [carID] INT NOT NULL IDENTITY(1,1),
    [carBrand] NVARCHAR(1000) NOT NULL,
    [carModel] NVARCHAR(1000) NOT NULL,
    [year] INT NOT NULL,
    [insuranceValidity] DATETIME2 NOT NULL,
    [roadTaxValidity] DATETIME2 NOT NULL,
    [technicalInspectionValidity] DATETIME2 NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [Car_pkey] PRIMARY KEY CLUSTERED ([carID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Car] ADD CONSTRAINT [Car_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
