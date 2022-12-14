declare type ErrorWithCode = Error & {
    code: number;
};
declare type MaybeErrorWithCode = ErrorWithCode | null | undefined;
export declare class InstructionUnpackErrorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InstructionPackErrorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotRentExemptError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class AlreadyInitializedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UninitializedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidMetadataKeyError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidEditionKeyError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UpdateAuthorityIncorrectError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UpdateAuthorityIsNotSignerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotMintAuthorityError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidMintAuthorityError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NameTooLongError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class SymbolTooLongError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UriTooLongError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UpdateAuthorityMustBeEqualToMetadataAuthorityAndSignerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MintMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class EditionsMustHaveExactlyOneTokenError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MaxEditionsMintedAlreadyError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class TokenMintToFailedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MasterRecordMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class DestinationMintMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class EditionAlreadyMintedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class PrintingMintDecimalsShouldBeZeroError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class OneTimePrintingAuthorizationMintDecimalsShouldBeZeroError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class EditionMintDecimalsShouldBeZeroError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class TokenBurnFailedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class TokenAccountOneTimeAuthMintMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class DerivedKeyInvalidError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class PrintingMintMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class OneTimePrintingAuthMintMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class TokenAccountMintMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class TokenAccountMintMismatchV2Error extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotEnoughTokensError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class PrintingMintAuthorizationAccountMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class AuthorizationTokenAccountOwnerMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class DisabledError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CreatorsTooLongError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CreatorsMustBeAtleastOneError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MustBeOneOfCreatorsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NoCreatorsPresentOnMetadataError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CreatorNotFoundError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidBasisPointsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class PrimarySaleCanOnlyBeFlippedToTrueError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class OwnerMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NoBalanceInAccountForAuthorizationError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ShareTotalMustBe100Error extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationExistsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationDoesNotExistError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationNotSetError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationAlreadyMadeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class BeyondMaxAddressSizeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NumericalOverflowErrorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationBreachesMaximumSupplyError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class AddressNotInReservationError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CannotVerifyAnotherCreatorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CannotUnverifyAnotherCreatorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class SpotMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class IncorrectOwnerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class PrintingWouldBreachMaximumSupplyError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class DataIsImmutableError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class DuplicateCreatorAddressError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationSpotsRemainingShouldMatchTotalSpotsAtStartError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidTokenProgramError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class DataTypeMismatchError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class BeyondAlottedAddressSizeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationNotCompleteError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class TriedToReplaceAnExistingReservationError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidOperationError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidOwnerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class PrintingMintSupplyMustBeZeroForConversionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class OneTimeAuthMintSupplyMustBeZeroForConversionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidEditionIndexError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationArrayShouldBeSizeOneError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class IsMutableCanOnlyBeFlippedToFalseError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CollectionCannotBeVerifiedInThisInstructionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class RemovedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MustBeBurnedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidUseMethodError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CannotChangeUseMethodAfterFirstUseError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CannotChangeUsesAfterFirstUseError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CollectionNotFoundError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidCollectionUpdateAuthorityError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CollectionMustBeAUniqueMasterEditionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UseAuthorityRecordAlreadyExistsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UseAuthorityRecordAlreadyRevokedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UnusableError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotEnoughUsesError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CollectionAuthorityRecordAlreadyExistsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CollectionAuthorityDoesNotExistError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidUseAuthorityRecordError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidCollectionAuthorityRecordError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidFreezeAuthorityError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidDelegateError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CannotAdjustVerifiedCreatorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CannotRemoveVerifiedCreatorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CannotWipeVerifiedCreatorsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotAllowedToChangeSellerFeeBasisPointsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class EditionOverrideCannotBeZeroError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidUserError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class RevokeCollectionAuthoritySignerIncorrectError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class TokenCloseFailedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class UnsizedCollectionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class SizedCollectionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MissingCollectionMetadataError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotAMemberOfCollectionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotVerifiedMemberOfCollectionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotACollectionParentError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CouldNotDetermineTokenStandardError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MissingEditionAccountError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotAMasterEditionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MasterEditionHasPrintsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class BorshDeserializationErrorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CannotUpdateVerifiedCollectionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class CollectionMasterEditionAccountInvalidError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class AlreadyVerifiedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class AlreadyUnverifiedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NotAPrintEditionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidMasterEditionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidPrintEditionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidEditionMarkerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class ReservationListDeprecatedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class PrintEditionDoesNotMatchMasterEditionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class EditionNumberGreaterThanMaxSupplyError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MustUnverifyError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidEscrowBumpSeedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MustBeEscrowAuthorityError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidSystemProgramError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class MustBeNonFungibleError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InsufficientTokensError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class BorshSerializationErrorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class NoFreezeAuthoritySetError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare class InvalidCollectionSizeChangeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
export declare function errorFromCode(code: number): MaybeErrorWithCode;
export declare function errorFromName(name: string): MaybeErrorWithCode;
export {};
