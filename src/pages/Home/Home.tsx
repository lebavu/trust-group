import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));
export default function FullWidthGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Item>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <Card sx={{ minHeight: "165px", minWidth: "49%", maxWidth: 345 }} className={cx("card", "gradient")}>
                <CardContent>
                  <AssessmentIcon sx={{ marginBottom: 2, color: "#fff" }} />
                  <Typography gutterBottom variant='h5' color='white' component='div'>
                    $500
                  </Typography>
                  <Typography variant='body2' color='white'>
                    Total Earning
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{ minHeight: "165px", minWidth: "49%", maxWidth: 345 }}
                className={cx("card", "gradient-light")}
              >
                <CardContent>
                  <AssessmentIcon sx={{ marginBottom: 2, color: "#fff" }} />
                  <Typography gutterBottom variant='h5' color='white' component='div'>
                    $500
                  </Typography>
                  <Typography variant='body2' color='white'>
                    Total Earning
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Stack spacing={2}>
              <Card sx={{ width: "100%" }} className={cx("card", "gradient")}>
                <CardContent sx={{ padding: "10px!important" }}>
                  <Stack spacing={2} direction='row' alignItems='center'>
                    <AssessmentIcon sx={{ color: "#fff" }} />
                    <div>
                      <Typography gutterBottom variant='h5' color='white' component='div'>
                        $500
                      </Typography>
                      <Typography variant='body2' color='white'>
                        Total Earning
                      </Typography>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ width: "100%" }} className={cx("card", "gradient-light")}>
                <CardContent sx={{ padding: "10px!important" }}>
                  <Stack spacing={2} direction='row' alignItems='center'>
                    <AssessmentIcon sx={{ color: "#fff" }} />
                    <div>
                      <Typography gutterBottom variant='h5' color='white' component='div'>
                        $500
                      </Typography>
                      <Typography variant='body2' color='white'>
                        Total Earning
                      </Typography>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography marginBottom={3} variant='h3' component='div'>
              Popular Products
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                <Typography>Accordion 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                  blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel2a-content' id='panel2a-header'>
                <Typography>Accordion 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                  blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disabled>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel3a-content' id='panel3a-header'>
                <Typography>Disabled Accordion</Typography>
              </AccordionSummary>
            </Accordion>
          </Item>
        </Grid>
        <Grid item xs={12} md={8}>
          xs=6 md=8
        </Grid>
      </Grid>
    </Box>
  );
}
