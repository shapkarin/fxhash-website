import {
  ContractAbstraction,
  OpKind,
  Wallet,
  WalletOperation,
} from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { Objkt } from "../../types/entities/Objkt"
import { getGentkFA2Contract } from "../../utils/gentk"
import { displayMutez } from "../../utils/units"
import {
  buildParameters,
  EBuildableParams,
} from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"

export type TListingOperationParams = {
  token: Objkt
  price: number
}

/**
 * List a gentk on the Marketplace
 */
export class ListingOperation extends ContractOperation<TListingOperationParams> {
  gentkContract: ContractAbstraction<Wallet> | null = null
  marketplaceContract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.gentkContract = await this.manager.getContract(
      getGentkFA2Contract(this.params.token)
    )
    this.marketplaceContract = await this.manager.getContract(
      FxhashContracts.MARKETPLACE_V2
    )
  }

  async call(): Promise<WalletOperation> {
    const updateOperatorsParams = [
      {
        add_operator: {
          owner: this.params.token.owner!.id,
          operator: FxhashContracts.MARKETPLACE_V2,
          token_id: this.params.token.id,
        },
      },
    ]

    const listingParams = {
      gentk: {
        id: this.params.token.id,
        version: this.params.token.version,
      },
      price: this.params.price,
    }

    return this.manager.tezosToolkit.wallet
      .batch()
      .with([
        {
          kind: OpKind.TRANSACTION,
          to: getGentkFA2Contract(this.params.token),
          amount: 0,
          parameter: {
            entrypoint: "update_operators",
            value: buildParameters(
              updateOperatorsParams,
              EBuildableParams.UPDATE_OPERATORS
            ),
          },
          storageLimit: 300,
        },
        {
          kind: OpKind.TRANSACTION,
          to: FxhashContracts.MARKETPLACE_V2,
          amount: 0,
          parameter: {
            entrypoint: "listing",
            value: buildParameters(listingParams, EBuildableParams.LISTING),
          },
          storageLimit: 450,
        },
      ])
      .send()
  }

  success(): string {
    return `You have listed ${this.params.token.name} for ${displayMutez(
      this.params.price
    )} tez`
  }
}
