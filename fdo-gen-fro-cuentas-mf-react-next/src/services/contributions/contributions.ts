import {
  IAporte,
  IPageInfo,
} from "@/components/Accounts/AffiliateConsultModule/Contribution/IContribution";
import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

export const contributionPost = async (
  payload: any
): Promise<
  IResponseData<{ page: IPageInfo; aporte: IAporte[] }> | undefined
> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/aporte/api/Aportes`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};

export const contributionDetailPost = async (
  payload: any
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/aporteDetalle/api/DetallesAportes`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};
