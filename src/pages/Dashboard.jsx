import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

// Dummy data for the pie charts
const dataKPI = [
    [{ name: 'Completed', value: 72, fill: '#0088FE' }, { name: 'Remaining', value: 28, fill: '#00C49F' }],
    [{ name: 'Completed', value: 60, fill: '#FFBB28' }, { name: 'Remaining', value: 40, fill: '#FF8042' }],
    [{ name: 'Completed', value: 50, fill: '#00C49F' }, { name: 'Remaining', value: 50, fill: '#FF8042' }],
    [{ name: 'Completed', value: 85, fill: '#0088FE' }, { name: 'Remaining', value: 15, fill: '#FFBB28' }]
];

// Dummy data for tables
const tableData = [
    { title: 'Raw Material Report', data: [{ metric: 'Total', value: '500 T' }, { metric: 'Processed', value: '350 T' }, { metric: 'In Queue', value: '150 T' }] },
    { title: 'Packaging Report', data: [{ metric: 'Total', value: '220 Packs' }, { metric: 'Completed', value: '180 Packs' }, { metric: 'Pending', value: '40 Packs' }] },
    { title: 'Dispatch Report', data: [{ metric: 'Total', value: '300 Orders' }, { metric: 'Delivered', value: '250 Orders' }, { metric: 'Pending', value: '50 Orders' }] }
];

const Dashboard = () => {
    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Grid container spacing={2}>
                {/* KPI Diagrams */}
                {dataKPI.map((data, index) => (
                    <Grid item xs={12} md={6} lg={3} key={index}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Stock KPI {index + 1}</Typography>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={60}>
                                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {/* Data Tables */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
                {tableData.map((table, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2}>{table.title}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table.data.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell component="th" scope="row">{row.metric}</TableCell>
                                            <TableCell align="right">{row.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Dashboard;
