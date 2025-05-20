import React from "react";
import MetricCard from "../../../Common/MetricCard";
import { Grid } from "@mui/material";

const SalesMetricsGrid = ({ metrics: metricsProp, type, onZeroSaleClick }) => {
  // console.log("rat", type);

  // Ensure metrics is an object, default to empty object if prop is falsy
  const metrics = metricsProp || {};

  return (
    <Grid
      container
      spacing={2}
      px={2}
      sx={{
        position: "relative",
      }}
    >
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Yesterday Sales"
          primaryValue={metrics.ydSale || 0}
          primaryChange={`${metrics.ydSaleGwth || 0}% VS PREV. DAY`}
          secondaryValue={`${metrics.ydqty || 0} Units`}
          secondaryChange={`${metrics.ydQtyGwth || 0}% VS PREV. DAY`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="QT Sales"
          primaryValue={metrics.qtdSale || 0}
          primaryChange={`${metrics.qtdSaleGwth || 0}% VS PREV. DAY`}
          secondaryValue={`${metrics.qtdqty || 0} Units`}
          secondaryChange={`${metrics.qtdQtyGwth || 0}% VS PREV. DAY`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Avg. Daily Sales [MTD]"
          primaryValue={metrics.avgMTDSale || 0}
          primaryChange={`${metrics.avgMTDSaleGwth || 0}% VS PREV. DAY`}
          secondaryValue={`${metrics.avgMTDQTY || 0} Units`}
          secondaryChange={`${metrics.avgMTDQtyGwth || 0}% VS PREV. DAY`}
        />
      </Grid>
      {type != "rat" ? (
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="ISPs Present Yesterday"
            primaryValue={metrics.ydispPresent || 0}
            primaryChange={`${metrics.ispAtt || 0}% VS PREV. DAY`}
          />
        </Grid>
      ) : (
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            type="rat2"
            title="Sellout Not Uploaded[Yesterday]"
            primaryValue={metrics.ydispPresent || 0}
            primaryChange={`${metrics.ispAtt || 0}% VS PREV. DAY`}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="MTD Sales"
          primaryValue={metrics.mtdSale || 0}
          primaryChange={`${metrics.mtdSaleGwth || 0}% VS PREV. DAY`}
          secondaryValue={`${metrics.mtdqty || 0} Units`}
          secondaryChange={`${metrics.mtdQtyGwth || 0}% VS PREV. DAY`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="YTD MTD"
          primaryValue={metrics.ytdSale || 0}
          primaryChange={`${metrics.ytdSaleGwth || 0}% VS PREV. DAY`}
          secondaryValue={`${metrics.ytdqty || 0} Units`}
          secondaryChange={`${metrics.ytdQtyGwth || 0}% VS PREV. DAY`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Avg. Monthly Sales [6M]"
          primaryValue={metrics.avg6MSale || 0}
          primaryChange={`${metrics.avg6MSaleGwth || 0}% VS PREV. DAY`}
          secondaryValue={`${metrics.avg6MQTY || 0} Units`}
          secondaryChange={`${metrics.avg6MQtyGwth || 0}% VS PREV. DAY`}
        />
      </Grid>
      {type != "rat2" ? (
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            type={type}
            title="Zero Sales ISP [Yesterday]"
            primaryValue={metrics.ydZeroSaleISP || 0}
            primaryChange={`${metrics.ydZeroSaleISPGwth || 0}% VS PREV. DAY`}
            onClick={onZeroSaleClick}
            style={{ cursor: 'pointer' }}
          />
        </Grid>
      ) : (
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            type="rat2"
            title="Zero Sales ISP [Yesterday]"
            primaryValue={metrics.ydZeroSaleISP || 0}
            primaryChange={`${metrics.ydZeroSaleISPGwth || 0}% VS PREV. DAY`}
            onClick={onZeroSaleClick}
            style={{ cursor: 'pointer' }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default SalesMetricsGrid;
