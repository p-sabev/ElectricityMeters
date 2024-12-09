import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiptComponent } from './receipt.component';
import { Reading } from '../../../core/models/readings.model';
import { Fee } from '../../../core/models/payment.model';
import { TranslateModule } from '@ngx-translate/core';

describe('ReceiptComponent', () => {
  let component: ReceiptComponent;
  let fixture: ComponentFixture<ReceiptComponent>;

  const mockFees: Fee[] = [
    { id: 1, description: 'Fee 1', value: 10 },
    { id: 2, description: 'Fee 2', value: 20 },
    { id: 3, description: 'Fee 3', value: 0 },
  ];

  const mockReading: Reading = {
    id: 1,
    dateFrom: new Date('2023-01-01'),
    dateTo: new Date('2023-01-31'),
    feeList: [],
    isPaid: true,
    value: 150,
    firstPhaseValue: 0,
    secondPhaseValue: 0,
    thirdPhaseValue: 0,
    amountDue: 150,
    difference: 0,
    currentPrice: 0,
    subscriber: {
      id: 1,
      name: 'Test Subscriber',
      phaseCount: 1,
      lastRecordDate: new Date('2023-01-01T00:00:00.000Z'),
      lastReading: 100,
      defaultReading: 50,
      numberPage: 0,
      switchboard: { id: 1, name: 'Switchboard 1' },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptComponent, TranslateModule.forRoot()],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptComponent);
    component = fixture.componentInstance;

    // Initialize @Input() properties
    component.reading = mockReading;
    component.fees = mockFees;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the total fees correctly', () => {
    const totalFees = component.getTotalFees();
    expect(totalFees).toBe(30); // Only considers fees with positive values
  });

  it('should return "нула лева и нула стотинки" for 0 price in priceToWords', () => {
    const words = component.priceToWords(0);
    expect(words).toBe('нула лева и нула стотинки');
  });

  it('should convert whole numbers to words in Bulgarian', () => {
    const words = component.priceToWords(123);
    expect(words).toBe('сто двадесет и три лева и нула стотинки');
  });

  it('should convert decimal prices to words in Bulgarian', () => {
    const words = component.priceToWords(123.45);
    expect(words).toBe('сто двадесет и три лева и четиридесет и пет стотинки');
  });

  it('should handle large numbers correctly in priceToWords', () => {
    const words = component.priceToWords(123456.78);
    expect(words).toBe(
      'сто двадесет и три хиляди четиристотин петдесет и шест лева и седемдесет и осем стотинки'
    );
  });

  it('should handle small numbers correctly in priceToWords', () => {
    const words = component.priceToWords(0.78);
    expect(words).toBe(
      'седемдесет и осем стотинки'
    );
  });

  it('should handle single-digit prices correctly in priceToWords', () => {
    const words = component.priceToWords(7.09);
    expect(words).toBe('седем лева и девет стотинки');
  });

  it('should correctly set @Input() properties', () => {
    expect(component.reading).toEqual(mockReading);
    expect(component.fees).toEqual(mockFees);
  });
});
