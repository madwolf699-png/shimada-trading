import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

/**
 *
 */
export default function Master() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          マスタ管理
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="outlined">
              商品マスタ
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="outlined">
              取引先マスタ
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="outlined">
              ユーザーマスタ
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
