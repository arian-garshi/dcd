import { config } from "./config"
import { __BaseService } from "./__BaseService"

import { getToken, loginAccessTokenKey } from "../Utils/common"

export class __ProjectService extends __BaseService {
    async getProject(id: string) {
        const project: Components.Schemas.ProjectWithAssetsDto = await this.get<Components.Schemas.ProjectWithAssetsDto>(`/${id}`)
        return project
    }

    async getRevision(projectId: string, revisionId: string) {
        const revision: Components.Schemas.RevisionWithCasesDto = await this.get<Components.Schemas.RevisionWithCasesDto>(`/${projectId}/revisions/${revisionId}`)
        return revision
    }

    async getAccess(projectId: string) {
        const access: Components.Schemas.AccessRightsDto = await this.get<Components.Schemas.AccessRightsDto>(`/${projectId}/access`)
        return access
    }

    public async createProject(contextId: string): Promise<Components.Schemas.ProjectWithAssetsDto> {
        const res: Components.Schemas.ProjectWithAssetsDto = await this.postWithParams(
            "",
            {},
            { params: { contextId } },
        )
        return res
    }

    public async createRevision(projectId: string, body: Components.Schemas.CreateRevisionDto): Promise<Components.Schemas.RevisionWithCasesDto> {
        const res: Components.Schemas.RevisionWithCasesDto = await this.post(
            `${projectId}/revisions`,
            { body },
        )
        return res
    }

    public async updateRevision(projectId: string, revisionId: string, body: Components.Schemas.UpdateProjectDto): Promise<Components.Schemas.RevisionWithCasesDto> {
        const res = await this.put(`${projectId}/revisions/${revisionId}`, { body })
        return res
    }

    public async updateProject(projectId: string, body: Components.Schemas.UpdateProjectDto): Promise<Components.Schemas.ProjectWithAssetsDto> {
        const res = await this.put(`${projectId}`, { body })
        return res
    }

    public async compareCases(projectId: string) {
        const res: Components.Schemas.CompareCasesDto[] = await this.get<Components.Schemas.CompareCasesDto[]>(`/${projectId}/case-comparison`)
        return res
    }
}

export const GetProjectService = async () => new __ProjectService({
    ...config.ProjectService,
    accessToken: await getToken(loginAccessTokenKey)!,
})
