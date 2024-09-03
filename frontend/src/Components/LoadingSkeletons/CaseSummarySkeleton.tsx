import React from "react"
import { Grid, Skeleton } from "@mui/material"

const CaseSummarySkeleton: React.FC = () => (
    <Grid container spacing={2} sx={{ padding: "16px" }}>
        {[...Array(2)].map((_, index) => (
            <Grid item xs={12} md={6} lg={3} key={`menu-item-${index + 1}`}>
                <Skeleton variant="text" animation="wave" width="80%" height={20} />
                <Skeleton animation="wave" height={60} />
            </Grid>
        ))}
        <Grid item xs={12}>
            <Skeleton animation="wave" variant="rounded" height={1400} />
        </Grid>
    </Grid>
)

export default CaseSummarySkeleton
